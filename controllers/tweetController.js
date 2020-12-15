const tweetServices = require('../services/tweetServices')

const tweetController = {
  getTweets: (req, res) => {
    tweetServices.getTweets(req, res, data => {
      return res.json(data)
    })
  },
  getTweet: (req, res) => {
    tweetServices.getTweet(req, res, data => {
      return res.json(data)
    })
  },
  postTweet: (req, res) => {
    tweetServices.postTweet(req, res, data => {
      return res.json(data)
    })
  },
  putTweet: (req, res) => {
    tweetServices.putTweet(req, res, data => {
      return res.json(data)
    })
  },
}

module.exports = tweetController