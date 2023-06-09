const { Reply, User } = require('../models')
const { getLastUpdated } = require('../_helpers')

const replyController = {
  getReplies: (req, res, next) => {
    const { id } = req.params
    Reply.findAll({
      where: { TweetId: id },
      include: { model: User, attributes: ['account', 'name', 'avatar'] },
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then((replies) => {
        replies.forEach((reply) => {
          getLastUpdated(reply)
        })
        console.log(replies)
        return res.json({ status: 'success', data: replies })
      })
      .catch((error) => next(error))
  },
  postReply: (req, res, next) => {
    const TweetId = req.params.id
    const { comment } = req.body
    if (!comment) { return res.json({ status: 'error', message: 'Comment is required' }) }
    if (comment.length > 140) {
      return res.json({
        status: 'error',
        message: 'Comment should not be more than 140 characters'
      })
    }

    return Reply.create({
      UserId: req.user.id,
      TweetId,
      comment
    })
      .then((user) =>
        res.json({
          status: 'success',
          message: 'Reply was successfully created'
        })
      )
      .catch((error) => next(error))
  },
  putReply: (req, res, next) => {
    const { id } = req.params
    const { comment } = req.body
    if (!id) { return res.json({ status: 'error', message: 'reply_id are required' }) }
    if (!comment) { return res.json({ status: 'error', message: 'Comment is required' }) }
    if (comment.length > 140) {
      return res.json({
        status: 'error',
        message: 'Comment should not be more than 140 characters'
      })
    }

    return Reply.findOne({ where: { id } })
      .then((reply) => {
        if (req.user.id !== reply.UserId) {
          return res.json({
            status: 'error',
            message: 'You can only edit your own reply'
          })
        }
        reply.comment = comment
        return reply.save()
      })
      .then((reply) =>
        res.json({
          status: 'success',
          message: 'Reply was successfully updated'
        })
      )
      .catch((error) => next(error))
  },
  deleteReply: (req, res, next) => {
    const { id } = req.params
    if (!id) { return res.json({ status: 'error', message: 'reply_id are required' }) }

    return Reply.findOne({ where: { id } })
      .then((reply) => {
        if (req.user.id !== reply.UserId) {
          return res.json({
            status: 'error',
            message: 'You can only delete your own reply'
          })
        }
        reply.destroy()
      })
      .then((reply) =>
        res.json({
          status: 'success',
          message: 'Reply was successfully deleted'
        })
      )
      .catch((error) => next(error))
  }
}

module.exports = replyController
