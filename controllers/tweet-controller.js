const createError = require('http-errors')
const { Op } = require('sequelize')
const helpers = require('../_helpers')
const { User, Tweet, Like, sequelize, Reply } = require('../models')
const timeFormat = require('../helpers/date-helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const loginUserId = helpers.getUser(req).id

      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
        attributes: [
          'id', 'UserId', 'description', 'createdAt',
          [sequelize.literal('( SELECT COUNT(*) FROM Likes AS likedCount  WHERE Tweet_id = Tweet.id)'), 'likeCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Replies AS repliesCount  WHERE Tweet_id = Tweet.id)'), 'replyCount'],
          [sequelize.literal(`EXISTS(SELECT id FROM Likes WHERE Likes.Tweet_id = Tweet.id AND Likes.User_id = ${loginUserId})`), 'isLiked']
        ],
        order: [['createdAt', 'DESC']]
      })

      const result = tweets.map(tweet => ({
        ...tweet,
        createdAt: timeFormat(tweet.createdAt),
        isLiked: !!tweet.isLiked
      }))

      return res.json(result)
    } catch (err) {
      return next(err)
    }
  },
  postTweets: async (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req)
      const { description } = req.body
      if (!description) throw createError(400, '內容不可空白')
      if (description.length > 140) throw createError(400, '字數不可超過 140 字')

      const tweet = await Tweet.create({
        description,
        UserId: loginUser.id
      })
      // const createdAt = tweet.get('createdAt')
      // const formattedCreatedAt = timeFormat(createdAt)
      // tweet.setDataValue('createdAt', formattedCreatedAt)
      const data = {
        ...tweet.toJSON(),
        createdAt: timeFormat(tweet.createdAt),
        replyCount: 0,
        likeCount: 0,
        isLiked: false,
        User: {
          id: loginUser.id,
          account: loginUser.account,
          name: loginUser.name,
          avatar: loginUser.avatar
        }
      }
      const { updatedAt, ...result } = data

      return res.json(result)
    } catch (err) {
      return next(err)
    }
  },
  getTweet: async (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    const TweetId = Number(req.params.tweet_id)

    try {
      const tweet = await Tweet.findByPk(TweetId, {
        raw: true,
        nest: true,
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] }
        ],
        attributes: [
          'id', 'UserId', 'description', 'createdAt',
          [sequelize.literal('( SELECT COUNT(*) FROM Replies AS repliesCount  WHERE Tweet_id = Tweet.id)'), 'replyCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Likes AS likedCount  WHERE Tweet_id = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS(SELECT id FROM Likes WHERE Likes.Tweet_id = Tweet.id AND Likes.User_id = ${loginUserId})`), 'isLiked']
        ]
      })

      if (!tweet) throw createError(404, '該推文不存在')
      tweet.isLiked = !!tweet.isLiked
      tweet.createdAt = timeFormat(tweet.createdAt)

      return res.json(tweet)
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    const TweetId = Number(req.params.tweet_id)

    try {
      const tweet = await Tweet.findByPk(TweetId, {
        attributes: ['id'],
        include: {
          model: Reply,
          attributes: { exclude: ['updatedAt'] },
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
            { model: Tweet, attributes: { exclude: ['description', 'createdAt', 'updatedAt'] }, include: { model: User, attributes: ['id', 'account'] } }
          ]
        },
        order: [[Reply, 'createdAt', 'DESC']]
      })

      if (!tweet) throw createError(404, '該推文不存在')

      const replies = [...tweet.Replies]
      const result = replies.map(reply => ({
        ...reply.toJSON(),
        createdAt: timeFormat(reply.createdAt)
      }))

      return res.json(result)
    } catch (err) {
      next(err)
    }
  },
  postReplies: async (req, res, next) => {
    const loginUser = helpers.getUser(req)
    const TweetId = Number(req.params.tweet_id)
    const { comment } = req.body

    if (comment.length > 140) throw createError(400, '字數不可超過 140 字')
    if (!comment) throw createError(400, '內容不可空白')

    try {
      const tweet = await Tweet.findByPk(TweetId, {
        include: { model: User, attributes: ['id', 'account'] }
      })
      if (!tweet) throw createError(404, '該推文不存在')

      const reply = await Reply.create({
        comment,
        UserId: loginUser.id,
        TweetId
      })
      // const createdAt = reply.get('createdAt')
      // const formattedCreatedAt = timeFormat(createdAt)
      // reply.setDataValue('createdAt', formattedCreatedAt)
      const data = {
        ...reply.toJSON(),
        createdAt: timeFormat(reply.createdAt),
        User: {
          id: loginUser.id,
          name: loginUser.name,
          account: loginUser.account,
          avatar: loginUser.avatar
        },
        Tweet: {
          id: tweet.id,
          UserId: tweet.UserId,
          User: {
            id: tweet.User.id,
            account: tweet.User.account
          }
        }
      }
      const { updatedAt, ...result } = data

      return res.json(result)
    } catch (err) {
      next(err)
    }
  },
  postLikes: async (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = Number(req.params.tweet_id)

    try {
      const [tweet, like] = await Promise.all([
        Tweet.findByPk(TweetId, { raw: true }),
        Like.findOne({
          where: { UserId, TweetId }
        })
      ])

      if (!tweet) throw createError(404, '該推文不存在')
      if (like) throw createError(404, '此 like 已存在')

      await Like.create({
        UserId,
        TweetId
      })

      return res.json({
        status: 'success',
        message: '使用者點擊喜歡貼文成功'
      })
    } catch (err) {
      next(err)
    }
  },
  postUnLikes: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(req.params.tweet_id)

      const [tweet, like] = await Promise.all([
        Tweet.findByPk(TweetId, { raw: true }),
        Like.findOne({
          where: { UserId, TweetId },
          attributes: ['id', 'UserId', 'TweetId', 'createdAt', 'updatedAt']
        })
      ])

      if (!tweet) throw createError(404, '該推文不存在')
      if (!like) throw createError(404, '已經 unlike 不要再逼它惹')

      await like.destroy()

      res.json({
        status: 'success',
        message: '使用者移除喜歡貼文成功'
      })
    } catch (err) {
      next(err)
    }
  },
  getTopUsers: async (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    const topUserLimit = 10

    try {
      const users = await User.findAll({
        where: { role: 'user', id: { [Op.ne]: loginUserId } },
        limit: topUserLimit,
        attributes: {
          include: [
            [sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE following_id = user.id )'), 'followerCount'],
            [sequelize.literal(`EXISTS(SELECT id FROM Followships WHERE following_id = user.id AND follower_id = ${loginUserId})`), 'isFollowed']
          ],
          exclude: ['password', 'email', 'cover', 'role', 'introduction', 'createdAt', 'updatedAt']
        },
        include: [{
          model: User,
          as: 'Followers',
          attributes: ['id', 'name']
        }],
        order: [[sequelize.literal('followerCount'), 'Desc']]
      })

      const result = users.map(users => {
        const { Followers, ...data } = users.toJSON()
        data.isFollowed = !!data.isFollowed

        return data
      })
      res.json(result)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
