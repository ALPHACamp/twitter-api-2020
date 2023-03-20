const { Tweet } = require('../models')

const adminServices = {
  // 推文
  getTweets: (req, cb) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => cb(null, tweets))
      .catch(err => cb(err))
  },
  deleteTweet: (req, cb) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error('此推文不存在')
        return tweet.destroy()
      })
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err))
  }
}
module.exports = adminServices
