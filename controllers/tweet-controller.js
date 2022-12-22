const { Tweet, User, Reply, Like, sequelize } = require('../models')
const helpers = require('../_helpers')
const { relativeTime, tweetSimplifyTime, tweetDetailTime } = require('../helpers/date-helper')
const { getOffset } = require('../helpers/pagination-helper')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      //  lazy loading
      const DEFAULT_LIMIT = 10
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const currentUserId = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: {
          model: User,
          attributes: ['id', 'avatar', 'account', 'name']
        },
        attributes: [
          'id',
          'createdAt',
          'description',
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${currentUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      })
      const data = tweets.map(tweet => ({
        ...tweet,
        createdAt: relativeTime(tweet.createdAt)
      }))
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(req.params.id, {
        include: {
          model: User,
          attributes: ['id', 'avatar', 'account', 'name']
        },
        attributes: [
          'id',
          'createdAt',
          'description',
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${currentUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
        ]
      })
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '推文不存在！'
        })
      }
      const data = tweet.toJSON()
      data.createdAt = [tweetSimplifyTime(data.createdAt), tweetDetailTime(data.createdAt)]
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const description = req.body.description.trim()
      await Tweet.create({
        UserId,
        description
      })
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },
  getTweetReplies: async (req, res, next) => {
    try {
      //  lazy loading
      const DEFAULT_LIMIT = 10
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '推文不存在！'
        })
      }
      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'comment', 'createdAt'],
        include: {
          model: User,
          attributes: ['id', 'avatar', 'account', 'name']
        },
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        where: { TweetId }
      })
      const data = replies.map(reply => ({
        ...reply,
        createdAt: relativeTime(reply.createdAt)
      }))
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  postTweetReply: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const comment = req.body.comment.trim()
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '推文不存在！'
        })
      }
      await Reply.create({
        UserId,
        TweetId,
        comment
      })
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },
  likeTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '推文不存在！'
        })
      }
      const like = await Like.findOrCreate({
        where: { UserId, TweetId }
      })
      if (!like[1]) {
        return res.status(422).json({
          status: 'error',
          message: '已表示喜歡'
        })
      }
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(req.params.id)
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '推文不存在！'
        })
      }
      const like = await Like.destroy({ where: { UserId, TweetId } })
      if (!like) {
        return res.status(404).json({
          status: 'error',
          message: '未表示喜歡'
        })
      }
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
