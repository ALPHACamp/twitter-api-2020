const db = require('../../models')
const Tweet = db.Tweet
const tweetService = require('../../services/tweetService')

const tweetController = {
  postTweet: (req, res) => {
    tweetService.postTweet(req, res, (data) => {
      return res.json(data)
    })
  },
  getTweets: (req, res) => {
    tweetService.getTweets(req, res, (data) => {
      return res.json(data)
    })
  },
  getTweet: (req, res) => {
    tweetService.getTweet(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = tweetController