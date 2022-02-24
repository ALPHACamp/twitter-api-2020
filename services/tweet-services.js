const { User, Tweet, Reply } = require('../models')

const tweetController = {
  getTweets: async (req, cb) => {
    try {
      const tweets = await Tweet.findAll({
        include: User,
        raw: true,
        nest: true
      })
      return cb(null, tweets)
    } catch (err) {
      return cb(err)
    }
  },
  getTweet: async (req, cb) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweet_id, {
        include: [
          Reply,
          User
        ],
        raw: true,
        nest: true
      })
      if (!tweet) {
        return cb(null, 'tweet_id does not exists.')
      }
      return cb(null, tweet)
    } catch (err) {
      return cb(err)
    }
  }
}
module.exports = tweetController
