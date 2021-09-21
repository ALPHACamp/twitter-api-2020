const TweetService = require('../services/tweetService.js')
const helpers = require('../_helpers')

const tweetController = {
  postTweet: async (req, res) => {
    const currentUserId = helpers.getUser(req).id
    const { description } = req.body

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
  getTweet: async (req, res) => {
    const currentUserId = helpers.getUser(req).id
    const { tweetId } = req.params

    try {
      const tweet = await TweetService.getTweet(currentUserId, tweetId)
      return res.status(200).json(tweet)
    } catch (error) {
      return res.status(500).json({
        status: error.name,
        message: error.message
      })
    }
  },
  postReply: async (req, res) => {
    const currentUserId = helpers.getUser(req).id
    const { tweetId } = req.params
    const { comment } = req.body

    try {
      const { status, message } = await TweetService.postReply(currentUserId, tweetId, comment)
      return res.status(200).json({ status, message })
    } catch (error) {
      return res.status(500).json({
        status: error.name,
        message: error.message
      })
    }
  },
  getReplies: async (req, res) => {
    const { tweetId } = req.params

    try {
      const replies = await TweetService.getReplies(tweetId)

      return res.status(200).json(replies)
    } catch (error) {
      return res.status(500).json({
        status: error.name,
        message: error.message
      })
    }
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
