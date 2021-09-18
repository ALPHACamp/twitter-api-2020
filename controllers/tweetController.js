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
  },
  addLike: (req, res) => {
    TweetService.addLike(req, res, (status, data) => {
      return res.status(status).json(data)
    })
  },
  removeLike: (req, res) => {
    TweetService.removeLike(req, res, (status, data) => {
      return res.status(status).json(data)
    })
  }
}

module.exports = tweetController
