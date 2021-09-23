const db = require('../models')
const User = db.User
const Reply = db.Reply

const replyService = {
  getTweetReplies: async (req, res, cb) => {
    try {
      // 留言，留言者資料
      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        where: { TweetId: req.params.tweet_id },
        attributes: ['comment', 'updatedAt'],
        include: { model: User, attributes: ['id', 'name', 'avatar', 'account'] }
      })
      return cb([...replies])
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  }
}

module.exports = replyService