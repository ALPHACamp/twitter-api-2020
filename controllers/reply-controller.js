const helper = require('../_helpers')
const { valueTrim } = require('../helpers/obj-helpers')
const { Tweet, Reply } = require('../models')

const replyController = {
  postReply: async (req, res, next) => {
    try {
      const TweetId = req.params.tweet_id
      const UserId = helper.getUser(req).id
      const { comment } = valueTrim(req.body)
      if (!comment) throw new Error('回覆不可空白')
      const tweet = await Tweet.findByPk(TweetId, { raw: true })
      if (!tweet) throw new Error('推文不存在')
      await Reply.create({ TweetId, UserId, comment })
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController
