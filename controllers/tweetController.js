const TweetService = require('../services/tweetService.js')
const helpers = require('../_helpers')

const tweetController = {
  postTweet: (req, res) => {
    TweetService.postTweet(req, res, (status, data) => {
      return res.status(status).json(data)
    })
  },
  getTweets: async (req, res) => {
    try {
      const tweets = await TweetService.getTweets(helpers.getUser(req).id)
      return res.status(200).json(tweets)
    } catch (error) {
      return res.status(500).json({
        status: error.name,
        message: error.message
      })
    }
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
