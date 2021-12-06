const tweetService = require('../../services/tweetService')

const tweetController = {
  getTweets: (req, res) => {
    tweetService.getTweets(req, res, data => {
      return res.json(data.tweets)
    })
  },

  postTweet: (req, res) => {
    tweetService.postTweet(req, res, data => {
      return res.json(data)
    })
  },

  getTweet: (req, res) => {
    tweetService.getTweet(req, res, data => {
      return res.json(data.tweet)
    })
  },

  likeTweet: (req, res) => {
    tweetService.likeTweet(req, res, data => {
      return res.json(data)
    })
  },

  unlikeTweet: (req, res) => {
    tweetService.unlikeTweet(req, res, data => {
      return res.json(data)
    })
  }
}
module.exports = tweetController
