const { User, Tweet, Reply } = require('../models')
const replyServices = require('../services/reply-service')
const helper = require('../_helpers')

const replyController = {
  // Get all replies include user on one tweet
  getReplies: async (req, res, next) => {
    const TweetId = req.params.tweet_id
    try {
      const replies = await replyServices.getReplies(TweetId)

      return res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },

  // Add a new reply
  postReply: async (req, res, next) => {
    const { comment } = req.body
    const TweetId = req.params.tweet_id
    const user = helper.getUser(req)

    try {
      const reply = await replyServices.postReply(comment, TweetId, user)

      return res.status(200).json(reply)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController
