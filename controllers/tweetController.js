const tweetService = require('../services/tweetService')

const tweetController = {
  postTweet: (req, res) => {
    tweetService.postTweet(req, res, data => res.status(data.status).json(data)
    )
  },

  postReply: (req, res) => {
    tweetService.postReply(req, res, data => res.status(data.status).json(data))
  },
}

module.exports = tweetController