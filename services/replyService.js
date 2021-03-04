const db = require('../models')
const Reply = db.Reply
const helper = require('../_helpers')

const replyService = {
  postReply: (req, res, callback) => {
    const user = helper.getUser(req)

    Reply.create({
      UserId: user.id,
      TweetId: req.params.tweet_id,
      comment: req.body.comment
    }).then(reply => {
      callback({ status: 'success', message: 'Reply was successfully created' })
    })
  },
  getReplies: (req, res, callback) => {
    Reply.findAll({
      where: { TweetId: req.params.tweet_id },
      raw: true, nest: true
    }).then(replies => {
      callback(replies)
    })
  }
}

module.exports = replyService