const { User, Tweet, Like, Reply, sequelize } = require('../models')
const { getUser, getOffset } = require('../_helpers')
const dayjs = require('dayjs')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 10
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const user = getUser(req)
      const tweets = await Tweet.findAll({
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount']
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        nest: true
      })
      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        isLiked: user?.Likes?.some(userLike => userLike?.TweetId === tweet.id),
        createdAt: dayjs(tweet.createdAt).valueOf()
      }))
      return res.status(200).json(data)
    } catch (err) { next(err) }
  },
  likeTweet: async (req, res, next) => {
    try {
      const TweetId = Number(req.params.id)
      const UserId = getUser(req).dataValues.id

      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) return res.status(404).json({ status: 'error', message: '找不到推文！' })

      const like = await Like.findOne({ where: { TweetId, UserId } })
      if (like) return res.status(400).json({ status: 'error', message: '使用者已經like此貼文！' })
      const createdLike = await Like.create({
        UserId,
        TweetId
      })

      return res.status(200).json(createdLike.toJSON())
    } catch (err) {
      next(err)
    }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const TweetId = Number(req.params.id)
      const UserId = getUser(req).dataValues.id

      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) return res.status(404).json({ status: 'error', message: '找不到推文！' })

      const like = await Like.findOne({ where: { TweetId, UserId } })
      if (!like) return res.status(400).json({ status: 'error', message: '使用者已經unlike此貼文！' })

      const deletedLike = await like.destroy()

      return res.status(200).json(deletedLike.toJSON())
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const user = getUser(req).id
      const { id } = req.params
      const tweet = await Tweet.findByPk(id, {
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
        ],
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS(SELECT true FROM Likes WHERE Likes.UserId = ${user} AND Likes.TweetId = Tweet.id)`), 'isLiked']
        ],
        raw: true,
        nest: true
      })

      if (!tweet) return res.status(404).json({ status: 'error', message: '找不到推文！' })
      return res.status(200).json(tweet)
    } catch (err) { next(err) }
  },
  getReplies: async (req, res, next) => {
    try {
      const TweetId = req.params.id

      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) return res.status(404).json({ status: 'error', message: '找不到推文！' })

      const replies = await Reply.findAll({
        include: { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        where: { TweetId },
        nest: true,
        raw: true
      })

      return res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  postReplies: async (req, res, next) => {
    try {
      const UserId = getUser(req).dataValues.id
      const TweetId = req.params.id
      const { comment } = req.body

      if (!comment || comment.trim().length === 0) return res.status(404).json({ status: 'error', message: '內容不可為空白！' })

      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) return res.status(404).json({ status: 'error', message: '找不到推文！' })

      const createdReply = await Reply.create({
        comment,
        TweetId,
        UserId
      })

      return res.status(200).json({ status: 'success', data: createdReply.toJSON() })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController
