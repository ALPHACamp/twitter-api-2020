const TweetService = require('../services/tweetService.js')
const helpers = require('../_helpers')

const tweetController = {
  postTweet: async (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
    const { description } = req.body

    try {
      const { status, message } = await TweetService.postTweet(currentUserId, description)
      return res.status(200).json({
        status,
        message
      })
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await TweetService.getTweets(helpers.getUser(req).id)
      return res.status(200).json(tweets)
    } catch (error) {
      next(error)
    }
  },
  getTweet: async (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
    const { tweetId } = req.params

    try {
      const tweet = await TweetService.getTweet(currentUserId, tweetId)
      return res.status(200).json(tweet)
    } catch (error) {
      next(error)
    }
  },
  postReply: async (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
    const { tweetId } = req.params
    const { comment } = req.body

    try {
      const { status, message } = await TweetService.postReply(currentUserId, tweetId, comment)
      return res.status(200).json({ status, message })
    } catch (error) {
      next(error)
    }
  },
  getReplies: async (req, res, next) => {
    const { tweetId } = req.params

    try {
      const replies = await TweetService.getReplies(tweetId)

      return res.status(200).json(replies)
    } catch (error) {
      next(error)
    }
  },
  addLike: async (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
    const { tweetId } = req.params

    try {
      const { status, message } = await TweetService.addLike(currentUserId, tweetId)

      return res.status(200).json({
        status,
        message
      })
    } catch (error) {
      next(error)
    }
  },
  removeLike: async (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
    const { tweetId } = req.params

    try {
      const { status, message } = await TweetService.removeLike(currentUserId, tweetId)

      return res.status(200).json({
        status,
        message
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tweetController
