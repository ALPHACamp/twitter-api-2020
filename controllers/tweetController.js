const tweetService = require('../services/tweetService')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const fromAdmin = req.originalUrl.includes('admin')
      const data = await tweetService.getTweets({}, fromAdmin)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },

  postTweet: async (req, res, next) => {
    try {
      const postData = {
        UserId: helpers.getUser(req).id,
        ...req.body
      }
      const data = await tweetService.postTweet(postData)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },

  getTweet: async (req, res, next) => {
    try {
      const data = await tweetService.getTweet(req.params.tweet_id)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },

  getTweetAndReplies: async (req, res, next) => {
    try {
      const data = await tweetService.getTweetAndReplies(req.params.tweet_id)
      return res.json(data.Replies)
    } catch (error) {
      next(error)
    }
  },

  postReply: async (req, res, next) => {
    try {
      const replyData = {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id,
        ...req.body
      }
      const data = await tweetService.postReply(replyData)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },

  likeTweet: async (req, res, next) => {
    try {
      const likeData = {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id
      }
      const data = await tweetService.likeTweet(likeData)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },

  unlikeTweet: async (req, res, next) => {
    try {
      const likeData = {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id
      }
      const data = await tweetService.unlikeTweet(likeData)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tweetController
