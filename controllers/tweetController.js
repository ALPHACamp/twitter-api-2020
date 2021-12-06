// 載入所需套件
const tweetService = require('../services/tweetService')

const tweetController = {
  postTweet: (req, res) => {
    try {
      tweetService.postTweet(req, res, data => {
        return res.json(data)
      })
    } catch (err) {
      return res.status(400).json({ status: err.name, message: err.message })
    }
  },

  getTweets: (req, res) => {
    tweetService.getTweets(req, res, data => {
      return res.json(data)
    })
  },

  getTweet: (req, res) => {
    tweetService.getTweet(req, res, data => {
      return res.json(data)
    })
  }
}

// tweetService exports
module.exports = tweetController