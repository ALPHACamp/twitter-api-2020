const { User, Tweet } = require('../models')
const helper = require('../_helpers')

const tweetController = {
  // Get all tweet data include user data, return in an Array
  getTweets: async (req, res, next) => {
    try {
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
  }
}

module.exports = tweetController
