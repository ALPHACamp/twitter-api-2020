const { User, Tweet, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  postReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      if (!comment) throw new Error('Comment is required!')
      const userId = helpers.getUser(req).id
      const user = await User.findByPk(userId)
      if (!user) throw new Error("User didn't exist")
      const tweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) throw new Error("Tweet didn't exist")
      await Reply.create({
        comment,
        TweetId: tweetId,
        UserId: userId
      })
      return res.status(200).json({ message: 'Reply posted successfully!' })
    } catch (err) { next(err) }
  },
  getReplies: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const replies = await Reply.findAll({
        where: { TweetId: tweetId },
        include: { model: User },
        order: [['createdAt', 'DESC']]
      })
      if (!replies) throw new Error("replies didn't exist")
      return res.status(200).json(replies)
    } catch (err) { next(err) }
  }
}

module.exports = tweetController
