const { User, Tweet, Reply } = require('../models')
const helper = require('../_helpers')
const tweetServices = require('../services/tweet-service')
const { getLikedTweetsIds } = require('../helpers/user')

const tweetController = {
  // Get all tweet data include user data and latest shows at front, return in an Array
  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [{ model: User, attributes: ['name', 'account', 'avatar'] }],
        raw: true,
        nest: true
      })

      // Clean data with isLiked
      const userLikes = await getLikedTweetsIds(req)

      tweets = tweets.map(tweet => ({
        ...tweet,
        isLiked: userLikes.includes(tweet.id)
      }))

      return res.status(200).json(tweets)
    } catch (error) {
      next(error)
    }
  },

  // Create a new tweet
  postTweet: async (req, res, next) => {
    try {
      // user need to be extract from helper in order to meet the test,
      // otherwise it will show timeout exceed 2000 ms.
      const user = helper.getUser(req)
      const { description } = req.body
      if (!description) throw new Error('Tweet description is required.')

      // Block description which is empty string
      if (description.trim() === '') throw new Error('Tweet cannot be empty.')

      // Block description which't exceed 140 words.
      if (description.length > 140)
        throw new Error('Tweet content must not exceed 140 words.')

      const tweet = await Tweet.create({
        UserId: user.id,
        description
      })

      return res.status(200).json({
        status: 'success',
        message: 'New tweet posted.',
        tweet
      })
    } catch (error) {
      next(error)
    }
  },

  // Get specific tweet include user and replies data
  getTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(tweetId, {
        include: [
          { model: User, attributes: ['name', 'account', 'avatar'] },
          {
            model: Reply,
            include: [
              { model: User, attributes: ['name', 'account', 'avatar'] }
            ]
          }
        ]
      })

      return res.status(200).json(tweet)
    } catch (error) {
      next(error)
    }
  },

  likeTweet: async (req, res, next) => {
    const tweetId = req.params.id
    const userId = req.user.id

    try {
      const like = await tweetServices.likeTweet(tweetId, userId)

      return res.status(200).json(like)
    } catch (err) {
      next(err)
    }
  },

  unlikeTweet: async (req, res, next) => {
    const tweetId = req.params.id
    const userId = req.user.id

    try {
      const unlike = await tweetServices.unlikeTweet(tweetId, userId)

      return res.status(200).json(unlike)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
