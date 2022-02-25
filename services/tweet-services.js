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
        return cb(new Error('tweet_id does not exists.'))
      }
      return cb(null, tweet)
    } catch (err) {
      return cb(err)
    }
  },
  postTweet: async (req, cb) => {
    try {
      const { description } = req.body
      const UserId = req.user?.id || null
      console.log(req.user)
      if (!description) {
        return cb(new Error('Description is required.'))
      }
      const newTweet = await Tweet.create({
        description,
        UserId
      })
      const tweetData = {
        status: 'suceess',
        data: {
          tweet: newTweet
        }
      }
      return cb(null, tweetData)
    } catch (err) {
      return cb(err)
    }
  }
}
module.exports = tweetController
