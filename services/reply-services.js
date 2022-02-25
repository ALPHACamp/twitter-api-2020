const { User, Tweet, Reply } = require('../models')

const replyController = {
  getReplies: async (req, cb) => {
    try {
      const TweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(TweetId)
      if (tweet === null) {
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
  }
}
module.exports = replyController
