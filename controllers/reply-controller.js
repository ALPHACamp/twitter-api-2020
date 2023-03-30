const helpers = require('../_helpers')
const { valueTrim } = require('../helpers/obj-helpers')
const { User, Tweet, Reply } = require('../models')

const replyController = {
  postReply: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const userId = helpers.getUser(req).id
      const { comment } = valueTrim(req.body)
      if (!comment) throw new Error('內容不可空白')
      if (comment.length > 140) throw new Error('回覆不可超過140字')

      const [user, tweet] = await Promise.all([
        User.findByPk(userId, { raw: true }),
        Tweet.findByPk(tweetId, { raw: true })
      ])
      if (!user) throw new Error('使用者不存在')
      if (!tweet) throw new Error('推文不存在')

      await Reply.create({ TweetId: tweetId, UserId: userId, comment })
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(tweetId, { raw: true })
      if (!tweet) throw new Error('推文不存在')
      const replies = await Reply.findAll({
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
        ],
        where: { tweetId },
        order: [['updatedAt', 'DESC']]
      })
      res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController
