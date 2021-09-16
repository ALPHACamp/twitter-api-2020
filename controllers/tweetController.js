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
  },
  postReply: (req, res) => {
    TweetService.postReply(req, res, (status, data) => {
      return res.status(status).json(data)
    })
  },
  getReplies: (req, res) => {
    TweetService.getReplies(req, res, (status, data) => {
      return res.status(status).json(data)
    })
  }
}

module.exports = tweetController
