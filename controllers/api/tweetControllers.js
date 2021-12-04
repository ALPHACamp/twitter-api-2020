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
  }
}
module.exports = tweetController
