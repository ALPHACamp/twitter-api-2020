// const db = require('../models')
// const Tweet = db.Tweet
const TweetService = require('../services/tweetService.js')

const tweetController = {
  postTweet: (req, res) => {
    TweetService.postTweet(req, res, (status, data) => {
      console.log(status)
      console.log(data)
      return res.status(status).json(data)
    })
  }
}

module.exports = tweetController
