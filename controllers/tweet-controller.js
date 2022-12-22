const { User, Tweet, Like, Reply, sequelize } = require('../models')
const helpers = require('../_helpers')
const dayjs = require('dayjs')
const { sanitizedInput, checkUriParam } = require('../helpers/sanitized')
const tweetController = {

  getTweets: async (req, res, next) => {
    try {
      const loginUserId = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`(SELECT (COUNT(*) > 0) FROM Likes WHERE Likes.UserId = ${loginUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
        ],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      const data = tweets.map(tweet => ({
        ...tweet,
        isLiked: Boolean(tweet.isLiked),
        createdAt: dayjs(tweet.createdAt).valueOf()
      }))
      return res.status(200).json(data)
    } catch (err) { next(err) }
  },

  addOneTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const description = req.body.description

      if (description.trim() === '') {
        return res.status(400).json({
          status: 'error',
          message: 'Discription is empty.'
        })
      }
      if (description.length > 140) {
        return res.status(422).json({
          status: 'error',
          message: 'Tweets content should be less than 140 characters.'
        })
      }

      await Tweet.create({ UserId, description })
      return res.status(200).json({ status: 'success' })
    } catch (err) { next(err) }
  },

  getOneTweet: async (req, res, next) => {
    try {
      const loginUserId = helpers.getUser(req).id
      const TweetId = Number(checkUriParam(sanitizedInput(req.params.tweet_id)))

      const tweet = await Tweet.findOne({
        where: { id: TweetId },
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal(`(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = ${TweetId})`), 'replyCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = ${TweetId})`), 'likeCount'],
          [sequelize.literal(`(SELECT (COUNT(*) > 0) FROM Likes WHERE Likes.UserId = ${loginUserId} AND Likes.TweetId = ${TweetId})`), 'isLiked']
        ],
        nest: true,
        raw: true
      })
      if (!tweet) { return res.status(404).json({ status: 'error', message: 'Cannot find this tweet.' }) }

      // Transform data and response
      // Must add 'raw: true' in query to get plain object

      const data = { ...tweet, isLiked: Boolean(tweet.isLiked), createdAt: dayjs(tweet.createdAt).valueOf() }
      return res.status(200).json(data)
    } catch (err) { next(err) }
  },

  getReplies: async (req, res, next) => {
    try {
      const TweetId = Number(checkUriParam(sanitizedInput(req.params.tweet_id)))

      // Check tweet existance
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) return res.status(404).json({ status: 'error', message: 'Cannot find this tweet.' })

      // Find all replies in database

      const replies = await Reply.findAll({
        where: { TweetId },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Tweet, attributes: ['id'], include: { model: User, attributes: ['id', 'account'] } }
        ],
        attributes: ['id', 'comment', 'createdAt'],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })

      if (replies.length === 0) return res.status(204).json({ status: 'success', message: 'There is no reply.' })

      // Transform data and response

      const data = replies.map(reply => ({
        ...reply,
        createdAt: dayjs(reply.createdAt).valueOf()
      }))
      return res.status(200).json(data)
    } catch (err) { next(err) }
  },

  addReply: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(checkUriParam(sanitizedInput(req.params.tweet_id)))
      const comment = req.body.comment

      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) { return res.status(404).json({ status: 'error', message: 'Cannot find this tweet.' }) }

      // Validate reply content(not empty and less than 140)
      if (comment.trim() === '') { return res.status(400).json({ status: 'error', message: 'Replied comment is empty.' }) }
      if (comment.length > 140) {
        return res.status(422).json({ status: 'error', message: 'Replied comment should be less than 140 characters.' })
      }

      await Reply.create({ UserId, TweetId, comment })
      return res.status(200).json({ status: 'success' })
    } catch (err) { next(err) }
  },

  likeOneTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(checkUriParam(sanitizedInput(req.params.tweet_id)))

      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) return res.status(404).json({ status: 'error', message: 'Cannot find this tweet.' })

      const like = await Like.findOne({ where: { UserId, TweetId } })
      if (like) return res.status(422).json({ status: 'error', message: 'You have already liked this tweet.' })

      await Like.create({ UserId, TweetId })
      return res.status(200).json({ status: 'success' })
    } catch (err) { next(err) }
  },

  unlikeOneTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(checkUriParam(sanitizedInput(req.params.tweet_id)))

      const like = await Like.findOne({ where: { UserId, TweetId } })
      if (!like) return res.status(404).json({ status: 'error', message: "Cannot find this tweet or you havn't like this tweet." })

      await like.destroy()
      return res.status(200).json({ status: 'success' })
    } catch (err) { next(err) }
  }
}

module.exports = tweetController
