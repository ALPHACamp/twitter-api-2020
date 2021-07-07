const tweetService = require('../services/tweetService')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const data = await tweetService.getTweets(req.user.id)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },

  getTweetsForAdmin: async (req, res, next) => {
    try {
      const data = await tweetService.getTweetsForAdmin()
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },

  postTweet: async (req, res, next) => {
    try {
      const postData = {
        UserId: req.user.id,
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
        UserId: req.user.id,
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
        UserId: req.user.id,
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
        UserId: req.user.id,
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
