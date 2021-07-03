const tweetService = require('../services/tweetService')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res) => {
    try {
      const data = await tweetService.getTweets()
      return res.status(200).json(data)
    } catch (error) {
      return res.json(error)
    }
  },

  postTweet: async (req, res) => {
    try {
      const postData = {
        UserId: helpers.getUser(req).id,
        ...req.body,
      }
      const data = await tweetService.postTweet(postData)
      return res.status(200).json(data)
    } catch (error) {
      return res.json(error)
    }
  },

  getTweet: async (req, res) => {
    try {
      const data = await tweetService.getTweet(req.params.tweet_id)
      return res.status(200).json(data)
    } catch (error) {
      return res.json(error)
    }
  },

  getTweetAndReplies: async (req, res) => {
    try {
      const data = await tweetService.getTweetAndReplies(req.params.tweet_id)
      return res.status(200).json(data.Replies)
    } catch (error) {
      return res.json(error)
    }
  },

  postReply: async (req, res) => {
    try {
      const data = await tweetService.postReply(req.body)
      return res.status(200).json(data)
    } catch (error) {
      return res.json(error)
    }
  },

  likeTweet: async (req, res) => {
    try {
      const data = await tweetService.likeTweet(req.body)
      return res.status(200).json(data)
    } catch (error) {
      return res.json(error)
    }
  },

  unlikeTweet: async (req, res) => {
    try {
      const data = await tweetService.unlikeTweet(req.body)
      return res.status(200).json(data)
    } catch (error) {
      return res.json(error)
    }
  },


}

module.exports = tweetController