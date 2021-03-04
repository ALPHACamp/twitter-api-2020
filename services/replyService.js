const db = require('../models')
const Reply = db.Reply
const helper = require('../_helpers')

const replyService = {
  postReply: async (req, res, callback) => {
    try {
      const user = helper.getUser(req)
      await Reply.create({
        UserId: user.id,
        TweetId: req.params.tweet_id,
        comment: req.body.comment
      })
      callback({ status: 'success', message: 'Reply was successfully created' })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'codeStatus 500' })
    }
  },
  getReplies: async (req, res, callback) => {
    try {
      const replies = await Reply.findAll({
        where: { TweetId: req.params.tweet_id },
        raw: true, nest: true
      })
      callback(replies)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'codeStatus 500' })
    }
  }
}

module.exports = replyService