const helpers = require('../_helpers')
const sequelize = require('sequelize')
const { Tweet, User, Reply, Like } = require('../models')

const tweetController = {
  getTweet: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) {
        return res.status(400).json({
          status: 'error',
          message: 'id of tweet is required'
        })
      }

      const tweetData = await Tweet.findByPk(id, {
        attributes: ['id', 'description', 'createdAt'],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Like, attributes: ['UserId'] },
          { model: Reply, attributes: ['id'] }
        ],
        nest: true
      })
      if (!tweetData) {
        return res.status(404).json({
          status: 'error',
          message: 'tweet not found'
        })
      }

      // set response contents
      const tweet = {
        id: tweetData.id,
        description: tweetData.description,
        createdAt: tweetData.createdAt,
        User: tweetData.User,
        replyCount: tweetData.Replies.length,
        likeCount: tweetData.Likes.length,
        isLiked: tweetData.Likes.map(like => like.UserId).includes(helpers.getUser(req).id)
      }

      return res.status(200).json(tweet)
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      // get all tweets and its reply and like number
      const tweets = await Tweet.findAll({
        attribute: [
          'id', 'description', 'UserId', 'createdAt',
          [
            sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'
          ]
        ],
        order: [['createdAt', 'DESC']],
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        raw: true,
        nest: true
      })
      if (!tweets.length) return res.status(404).json({ status: 'error', message: 'Tweet is not found' })
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  addTweet: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const { description } = req.body
      if (!userId || !description) {
        return res.status(400).json({
          status: 'error',
          message: 'userId and description required'
        })
      }

      if (description.length > 140) {
        return res.status(400).json({
          status: 'error',
          message: 'tweet should be within 140 characters'
        })
      }

      await Tweet.create({ userId, description })
      return res.status(200).json({ status: 'success', message: 'New tweet added' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
