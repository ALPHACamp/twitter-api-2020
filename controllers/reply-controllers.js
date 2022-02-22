const { User, Tweet, Reply } = require('../models')
const helper = require('../_helpers')

const replyController = {
  // Get all replies include user on one tweet
  getReplies: async (req, res, next) => {
    try {
      const TweetId = req.params.tweet_id

      // Check if tweet exists
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('This tweet does not exist.')

      const replies = await Reply.findAll({
        where: { TweetId },
        include: [{ model: User, attributes: ['name', 'account', 'avatar'] }],
        order: [['createdAt', 'DESC']]
      })

      return res.status(200).json(replies)
    } catch (error) {
      next(error)
    }
  },

  // Add a new reply
  postReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      const TweetId = req.params.tweet_id
      const user = helper.getUser(req)

      // Check if tweet exists
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('This tweet does not exist.')

      // Check if comment is valid
      if (!comment.trim()) throw new Error('Comment must not be empty')

      const reply = await Reply.create({
        UserId: user.id,
        TweetId,
        comment
      })

      return res.status(200).json(reply)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = replyController
