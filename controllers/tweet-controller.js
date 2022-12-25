const { Tweet, User, Like, Reply, sequelize } = require('../models')
const helpers = require('../_helpers')
const { dateFormat } = require('../helpers/date-helper')

const tweetController = {
  // 新增推文：
  postTweet: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const { description } = req.body
      if (!description?.trim()) throw new Error('內容不可空白!')
      if (description?.length > 140) throw new Error('推文字數限制在 140 以內!')
      const tweet = await Tweet.create({
        UserId: currentUser.id,
        description
      })
      const newTweet = tweet.toJSON()
      res.status(200).json(newTweet)
    } catch (error) {
      next(error)
    }
  },
  // 取得所有推文：
  getTweets: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const tweets = await Tweet.findAll({
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatar']
          }],
        attributes: {
          exclude: ['updatedAt'], // 如果把createdAt也拿掉，會影響到下面relativeTime的呈現時間
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id )'), 'replyCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id )'), 'likeCount'],
            [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${currentUser.id} AND Likes.TweetId = Tweet.id )`), 'isLiked']
          ]
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!tweets) {
        const err = new Error('推文不存在!')
        err.status = 404
        throw err
      }
      const newTweets = tweets.map(tweet => ({
        ...tweet,
        relativeTime: dateFormat(tweet.createdAt).fromNow()
      }))
      res.status(200).json(newTweets)
    } catch (error) {
      next(error)
    }
  },
  // 取得一則推文：
  getTweet: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const tweet = await Tweet.findByPk(req.params.tweet_id, {
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatar']
          }],
        attributes: {
          exclude: ['updatedAt'],
          include: [
            'id', 'UserId', 'description',
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id )'), 'replyCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id )'), 'likeCount'],
            [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${currentUser.id} AND Likes.TweetId = Tweet.id )`), 'isLiked']
          ]
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!tweet) {
        const err = new Error('推文不存在!')
        err.status = 404
        throw err
      }
      const tweetAddTime = {
        ...tweet,
        exactTime: dateFormat(tweet.createdAt).format('A hh:mm YYYY年 MMM DD日'),
        relativeTime: dateFormat(tweet.createdAt).fromNow()
      }
      res.status(200).json(tweetAddTime)
    } catch (error) {
      next(error)
    }
  },
  // 將推文加入喜歡
  addLike: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const TweetId = Number(req.params.id)
      const [tweet, like] = await Promise.all([
        Tweet.findByPk(TweetId, { raw: true }),
        Like.findOne({
          where: {
            UserId: currentUser.id,
            TweetId
          }
        })
      ])
      if (!tweet) throw new Error('推文不存在!')
      if (tweet.UserId === currentUser.id) throw new Error('不能按讚自己的推文!')
      if (like) throw new Error('你已經按讚此推文了!')
      const newLike = await Like.create({
        UserId: currentUser.id,
        TweetId
      })
      const newLikeData = newLike.toJSON()
      res.status(200).json(newLikeData)
    } catch (error) {
      next(error)
    }
  },
  // 將推文移除喜歡
  removeLike: async (req, res, next) => {
    try {
      const paramsId = Number(req.params.id)
      const like = await Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: paramsId
        }
      })
      if (!like) throw new Error('你還沒按讚此推文!')
      const newUnlike = await like.destroy()
      const newUnlikeData = newUnlike.toJSON()
      res.status(200).json(newUnlikeData)
    } catch (error) {
      next(error)
    }
  },
  // 新增推文回覆
  postReply: async (req, res, next) => {
    try {
      const TweetId = req.params.tweet_id
      const UserId = helpers.getUser(req).id
      const { comment } = req.body
      if (!comment?.trim()) throw new Error('內容不可空白!')
      const [user, tweet] = await Promise.all([
        User.findByPk(UserId),
        Tweet.findByPk(TweetId)
      ])
      if (!user) throw new Error('使用者不存在!')
      if (!tweet) throw new Error('推文不存在!')
      const reply = await Reply.create({
        comment,
        TweetId,
        UserId
      })
      const newReply = reply.toJSON()
      res.status(200).json(newReply)
    } catch (error) {
      next(error)
    }
  },
  // 該則推文的所有回覆
  getReplies: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        where: { TweetId: req.params.tweet_id },
        attributes: { exclude: ['updatedAt'] },
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatar']
          },
          {
            model: Tweet,
            attributes: ['UserId'],
            include: {
              model: User,
              attributes: ['account']
            }
          }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!replies) throw new Error('留言回覆不存在!')
      const newReplies = replies
        .map(reply => ({
          ...reply,
          relativeTime: dateFormat(reply.createdAt).fromNow()
        }))
      res.status(200).json(newReplies)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tweetController
