const { Tweet } = require('../../models')

const tweetController = {
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      const tweet = await Tweet.create({
        UserId: res.locals.userId,
        description
      })
      return res.json({ status: 'success', data: tweet })
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll()
      if (!tweets) return res.json({ status: 'error', data: 'There is no tweet' })
      return res.json({ status: 'success', data: tweets })
    } catch (error) {
      next(error)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const { tweet_id } = req.params
      const tweet = await Tweet.findByPk(tweet_id)
      if (!tweet) return res.json({ status: 'error', data: 'The tweet does not exist' })
      return res.json({ status: 'success', data: tweet })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tweetController
