const tweetService = require('../services/tweetService')

const tweetController = {
  postTweet: (req, res) => {
    const { redis, body, user: { id: loginUser } } = req
    tweetService.postTweet(body, loginUser, redis, data => res.status(data.status).json(data)
    )
  },

  postReply: (req, res) => {
    tweetService.postReply(req, res, data => res.status(data.status).json(data))
  },

  getTweet: (req, res) => {
    tweetService.getTweet(req, res, data => res.status(data.status).json(data)
    )
  },
  getTweets: (req, res) => {
    const { redis, user: { id } } = req
    tweetService.getTweets(redis, id, data => {
      if (data.status) return res.status(data.status).json(data)
      return res.status(200).json(data)
    })
  },
  putTweet: (req, res) => {
    tweetService.putTweet(req, res, data => {
      if (data.status) return res.status(data.status).json(data)
      return res.status(200).json(data)
    })
  }
}

module.exports = tweetController