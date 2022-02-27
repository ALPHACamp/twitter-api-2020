const { User, Tweet, Reply } = require('../models')

const replyController = {
  getReplies: async (req, cb) => {
    try {
      const TweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return cb(new Error('tweet_id does not exist.'))
      }
      const replies = await Reply.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] }
          }
        ],
        where: {
          TweetId
        },
        raw: true,
        nest: true
      })
      return cb(null, replies)
    } catch (err) {
      return cb(err)
    }
  },
  postReply: async (req, cb) => {
    try {
      const UserId = req.user?.id || null
      const { comment } = req.body
      if (!comment) {
        return cb(new Error('Comment is required.'))
      } else if (comment.length > 140) {
        return cb(new Error('Comment is longer than 140 words.'))
      }

      const tweet = await Tweet.findByPk(req.params.tweet_id)
      if (!tweet) {
        return cb(new Error('tweet_id does not exist.'))
      }
      const newReply = await Reply.create({
        TweetId: req.params.tweet_id,
        comment,
        UserId
      })
      const replyData = {
        status: 'success',
        data: {
          Reply: newReply
        }
      }
      return cb(null, replyData)
    } catch (err) {
      return cb(err)
    }
  }

}
module.exports = replyController
