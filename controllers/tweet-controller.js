const { User, Tweet, Like, Reply, sequelize } = require('../models')
const helpers = require('../_helpers')
const dayjs = require('dayjs')
const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req)
      const tweets = await Tweet.findAll({
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount']
        ],
        order: [['createdAt', 'DESC']],
        nest: true
      })
      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        isLiked: loginUser?.Likes?.some(loginUserLike => loginUserLike?.TweetId === tweet.id),
        createdAt: dayjs(tweet.createdAt).valueOf()
      }))
      return res.status(200).json(data)
    } catch (err) { next(err) }
  },

  addOneTweet: async (req, res, next) => {
    try {
      // Get user and tweet data from req
      // Validate tweet content(not empty and less than 140)
      // Create a tweet
      return res.status(200).json('JSON Response')
    } catch (err) { next(err) }
  },

  getOneTweet: async (req, res, next) => {
    try {
      // Get tweet_id from req
      // Find tweet in database
      // Transform data
      return res.status(200).json('JSON Response')
    } catch (err) { next(err) }
  },

  getReplies: async (req, res, next) => {
    try {
      // Get tweet_id from req
      // Find all replies in database
      // Transform data
      return res.status(200).json('JSON Response')
    } catch (err) { next(err) }
  },

  addReply: async (req, res, next) => {
    try {
      // Get user, tweet_id and reply data from req
      // Validate reply content(not empty)
      // Create a tweet
      return res.status(200).json('JSON Response')
    } catch (err) { next(err) }
  },

  likeOneTweet: async (req, res, next) => {
    try {
      // Get user and tweet_id from req
      // Check record don't exist
      return res.status(200).json('JSON Response')
    } catch (err) { next(err) }
  },

  unlikeOneTweet: async (req, res, next) => {
    try {
      // Get user and tweet_id from req
      // Check record existance
      // Delete record
      return res.status(200).json('JSON Response')
    } catch (err) { next(err) }
  }
}

module.exports = tweetController
