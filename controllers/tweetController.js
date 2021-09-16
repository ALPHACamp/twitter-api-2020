const TweetService = require('../services/tweetService.js')

const tweetController = {
  postTweet: (req, res) => {
    TweetService.postTweet(req, res, (status, data) => {
      return res.status(status).json(data)
    })
  },
  getTweets: (req, res) => {
    TweetService.getTweets(req, res, (status, data) => {
      return res.status(status).json(data)
    })
  },
  getTweet: (req, res) => {
    TweetService.getTweet(req, res, (status, data) => {
      return res.status(status).json(data)
    })
  }
}

module.exports = tweetController
