const tweetService = require('../../services/tweetService.js')

const tweetController = {
  getTweets: (req, res) => {
    tweetService.getTweets(req, res, (data) => {
      return res.json(data)
    })
  },

  getTweet: (req, res) => {
    tweetService.getTweet(req, res, (data) => {
      return res.json(data)
    })
  },

  postTweet: (req, res) => {
    tweetService.postTweet(req, res, (data) => {
      return res.json(data)
    })
  },

  putTweet: (req, res) => {
    tweetService.putTweet(req, res, (data) => {
      return res.json(data)
    })
  },

  getLikes: (req, res) => {
    tweetService.getLikes(req, res, (data) => {
      return res.json(data)
    })
  },

  addLike: (req, res) => {
    tweetService.addLike(req, res, (data) => {
      return res.json(data)
    })
  },

  removeLike: (req, res) => {
    tweetService.removeLike(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = tweetController