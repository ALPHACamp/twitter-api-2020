const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const helpers = require('../_helpers')
const Notification = db.Notification

const replyServices = {
  postReply: (req, res, callback) => {
    const userId = helpers.getUser(req).id
    const userName = helpers.getUser(req).name
    const comment = req.body.comment.trim()
    if (!comment) {
      return callback({ status: 'error', message: 'Reply can not be blank' })
    } else {
      return Promise.all([
        Reply.create({
          UserId: userId,
          TweetId: req.params.tweet_id,
          comment: comment
        }),
        Tweet.findOne({
          where: { id: req.params.tweet_id },
          include: [User]
        }).then(tweet => {
          const recipientId = tweet.User.id
          Notification.create({
            senderId: userId,
            recipientId: recipientId,
            isRead: false,
            messageData: `${userName}回覆了你的貼文`
          })
        })
      ]).then(reply => {
        return callback({ status: 'success', message: 'Reply was successfully posted' })
      })
    }
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
