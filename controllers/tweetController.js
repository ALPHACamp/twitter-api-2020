const TweetService = require('../services/tweetService.js')
const helpers = require('../_helpers')
const validator = require('validator')

const tweetController = {
  postTweet: async (req, res) => {
    const currentUserId = helpers.getUser(req).id
    const description = req.body.description.trim()

    if (!description.length) {
      return res.status(400).json({ status: 'error', message: "tweet content can't be blank" })
    }

    if (description.length && !validator.isByteLength(description, { min: 0, max: 140 })) {
      return res.status(400).json({ status: 'error', message: 'tweet length can not over 140 characters' })
    }

    try {
      const { status, message } = await TweetService.postTweet(currentUserId, description)
      return res.status(200).json({
        status,
        message
      })
    } catch (error) {
      return res.status(500).json({
        status: error.name,
        message: error.message
      })
    }
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
