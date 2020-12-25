const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const helpers = require('../_helpers')

const replyServices = {
  postReply: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    const comment = req.body.comment.trim()
    Reply.create({
      UserId: USERID,
      TweetId: req.params.tweet_id,
      comment: comment
    }).then(reply => {
      return callback({ status: 'success', message: 'Reply was successfully posted' })
    })
  },
  getReply: (req, res, callback) => {
    Tweet.findByPk(req.params.tweet_id, {
      include: [
        User
      ]
    }).then(tweet => {
      Reply.findAndCountAll({ include: [User], where: { TweetId: req.params.tweet_id } })
        .then(replies => {
          Like.findAndCountAll({ where: { TweetId: req.params.tweet_id } })
            .then(likes => {
              const data = replies.rows[0]
              return callback([data, tweet, likes, replies])
            })
        })
    })
  },
  getSingleReply: (req, res, callback) => {
    Reply.findByPk(req.params.reply_id, { include: [User] })
      .then(reply => {
        return callback({ reply })
      })
  },
  putReply: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    Reply.findByPk(req.params.reply_id, { include: [User] })
      .then(reply => {
        if (reply.UserId === USERID) {
          reply.update({
            comment: req.body.comment
          })
            .then(reply => { return callback({ status: 'success', message: 'Reply comment is updated' }) })
        } else {
          return callback({ status: 'error', message: 'User error' })
        }

      })
  },
  deleteReply: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    Reply.findByPk(req.params.reply_id, { include: [User] })
      .then(reply => {
        if (reply.UserId === USERID) {
          reply.destroy()
            .then(reply => { return callback({ status: 'success', message: 'Reply was been deleted' }) })
        } else {
          return callback({ status: 'error', message: 'User error' })
        }

      })
  }
}
module.exports = replyServices