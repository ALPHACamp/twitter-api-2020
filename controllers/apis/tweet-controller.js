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
      const tweets = await Tweet.findAll({ })
      const result = tweets.map(tweet => ({
        ...tweet.toJSON()
      }))
      return res.json({ status: 'success', data: result })
    } catch (error) {
      next(error)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const id = req.params.id
      const tweet = await Tweet.findByPk(id, { raw: true })
      return res.json({ status: 'success', data: tweet })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tweetController
