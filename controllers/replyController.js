const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const helpers = require('../_helpers')

const replyController = {
  getReplies: (req, res) => {
    Reply.findAll({
      where: { TweetId: req.params.tweetId },
      include: User,
      order: [['createdAt', 'DESC']]
    }).then((replies) => {
      replies.forEach(reply => {  // 把User.password刪掉
        reply.dataValues.User.password = ""
        // delete reply.dataValues.User.password 無作用
      })
      return res.json(replies)
    })
  },
  postReply: (req, res) => {
    if (!req.body.comment) {
      return res.json({ status: 'error', message: 'No comment content' })
    }
    if (req.body.comment.length >= 280) {
      return res.json({ status: 'error', message: 'Comment exceeds limit' })
    }
    Reply.create({
      TweetId: req.params.tweetId,
      UserId: helpers.getUser(req).id,
      comment: req.body.comment
    }).then(() => {
      return res.json({ status: 'success', message: '' })
    })
  }
}


module.exports = replyController