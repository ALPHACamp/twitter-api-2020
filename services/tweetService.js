const db = require('../models')
const Tweet = db.Tweet

const tweetService = {
  postTweet: (req, res, callback) => { },
  getTweets: (req, res, callback) => {
    Tweet.findAll({ raw: true, nest: true }, { order: [['createdAt', 'DESC']] })
      .then(tweets => {
        callback(tweets)
      })
  },
  getTweet: (req, res, callback) => { }
}

module.exports = tweetService