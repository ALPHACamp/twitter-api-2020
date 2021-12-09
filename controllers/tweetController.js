const tweetService = require('../services/tweetService')

const tweetController = {
  postTweet: async (req, res) => {
    const { description } = req.body
    const viewerId = Number(req.user.id)

    try {
      const data = await tweetService.postTweet(viewerId, description)
      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  postReply: async (req, res) => {
    const { comment } = req.body
    const TweetId = Number(req.params.id)
    const viewerId = Number(req.user.id)

    try {
      const data = await tweetService.postReply(viewerId, TweetId, comment)
      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  getSingleTweet: async (req, res) => {
    const tweetId = Number(req.params.id)
    const viewerId = Number(req.user.id)

    try {
      const data = await tweetService.getSingleTweet(viewerId, tweetId)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  getTweets: async (req, res) => {
    const viewerId = Number(req.user.id)

    try {
      const data = await tweetService.getTweets(viewerId, 'user')

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  postLike: async (req, res) => {
    const viewerId = Number(req.user.id)
    const TweetId = Number(req.params.id)

    try {
      const data = await tweetService.postLike(viewerId, TweetId)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  postUnlike: async (req, res) => {
    const viewerId = req.user.id
    const TweetId = req.params.id

    try {
      const data = await tweetService.postUnlike(viewerId, TweetId)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  getTweetReplies: async (req, res) => {
    const TweetId = req.params.id

    try {
      const data = await tweetService.getTweetReplies(TweetId)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  }
}

module.exports = tweetController
