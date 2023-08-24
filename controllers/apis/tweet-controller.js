const { Tweet } = require('../../models')

const tweetContorller = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true
      })
      res.json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id

      const tweet = await Tweet.findByPk(tweetId)
      res.json(tweet)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetContorller
