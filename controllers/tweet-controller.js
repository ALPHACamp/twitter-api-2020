const { Tweet, User, Reply, Like, sequelize } = require('../models')
const helpers = require('../_helpers')
const { relativeTime } = require('../helpers/tweet-helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
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
        order: [['createdAt', 'DESC']]
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
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: "This tweet doesn't exist!"
        })
      }
      const data = tweet.toJSON()
      data.createdAt = relativeTime(data.createdAt)
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const description = req.body.description.trim()
      if (!description) {
        return res.status(400).json({
          status: 'error',
          message: 'Tweet description is required!'
        })
      }
      if (description.length > 140) {
        return res.status(400).json({
          status: 'error',
          message: 'Tweet description can\'t exceed 140 characters!'
        })
      }
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
      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'comment', 'createdAt'],
        include: {
          model: User,
          attributes: ['id', 'avatar', 'account', 'name']
        },
        where: { TweetId: req.params.id }
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
      if (!comment) {
        return res.status(400).json({
          status: 'error',
          message: 'Reply comment is required!'
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
      const TweetId = Number(req.params.id)
      const isExist = Boolean(await Tweet.findByPk(TweetId))
      if (!isExist) {
        return res.status(404).json({
          status: 'error',
          message: 'Tweet doesn\'t exist'
        })
      }
      const isLiked = await Like.findOrCreate({
        where: { UserId, TweetId }
      })
      if (!isLiked[1]) {
        return res.status(400).json({
          status: 'error',
          message: 'You have liked this tweet!'
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
      const aaa = await Like.destroy({ where: { UserId, TweetId } })
      if (!aaa) {
        return res.status(404).json({
          status: 'error',
          message: 'Tweet doesn\'t exist or you haven\'t like this tweet!'
        })
      }
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
