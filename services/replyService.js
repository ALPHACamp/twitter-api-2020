const db = require('../models')
const { Reply, User } = db
const helpers = require('../_helpers')

const replyService = {
  // 查詢推文的相關回覆資料
  getReplies: (req, res, callback) => {
    const id = req.params.tweet_id

    return Reply.findAll({
      where: { TweetId: id },
      include: [{ model: User, attributes: ['name', 'account'] }]
    })
      .then((replies) => {
        return callback(replies)
      })
      .catch((error) => callback({ status: 'error', message: 'Get Replies Fail' }))
  },

  // 查詢推文的相關回覆量
  getRepliesCount: (req, res, callback) => {
    const id = req.params.tweet_id

    return Reply.findAll({
      where: { TweetId: id },
      include: [{ model: User, attributes: ['name', 'account'] }]
    })
      .then((replies) => {
        return callback({ repliesNumber: replies.length })
      })
      .catch((error) => callback({ status: 'error', message: 'Get Replies Fail' }))
  },

  // 新增回覆
  postReply: (req, res, callback) => {
    const { comment } = req.body

    if (!comment.trim()) {
      return callback({ status: 'error', message: 'Comment can not empty' })
    }

    return Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweet_id,
      comment: comment.trim()
    })
      .then((reply) => {
        return callback({ status: 'success', message: 'Created Reply Success' })
      })
      .catch((error) => callback({ status: 'error', message: 'Post Reply Fail' }))
  },

  // 更新回覆內容
  putReply: (req, res, callback) => {
    const { comment } = req.body
    const id = req.params.reply_id

    if (!comment.trim()) {
      return callback({ status: 'error', message: 'Comment can not empty' })
    }

    return Reply.findByPk(id)
      .then((reply) => {
        reply.update({
          comment: comment.trim()
        })
          .then((reply) => {
            return callback({ status: 'success', message: 'Reply was successfully to update' })
          })
      })
      .catch((error) => callback({ status: 'error', message: 'Put Reply Fail' }))
  },

  // 刪除回覆
  deleteReply: (req, res, callback) => {
    const id = req.params.reply_id

    return Reply.findByPk(id)
      .then((reply) => {
        if (!reply) {
          return callback({ status: 'error', message: 'Reply was not exist' })
        }

        reply.destroy()
          .then((result) => {
            return callback({ status: 'success', message: 'Delete Reply Success' })
          })
      })
      .catch((error) => callback({ status: 'error', message: 'Delete Tweet Fail' }))
  }
}

module.exports = replyService