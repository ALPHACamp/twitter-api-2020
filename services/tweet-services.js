const { Tweet } = require('../models')

const tweetServices = {
  getTweets: (req, cb) => {
    Tweet.findAll()
      .then(tweets => cb(null, tweets))
      .catch(err => cb(err))
  }
}
module.exports = tweetServices
