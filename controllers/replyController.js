const { Reply, User, Tweet } = require('../models')
const { getLastUpdated, getUser } = require('../_helpers')

const replyController = {
  getReplies: async (req, res, next) => {
    const { id } = req.params
    try {
      const tweet = await Tweet.findByPk(id,
        {
          include: [{ model: User, attributes: ['account', 'name', 'avatar'] }],
          raw: true,
          nest: true
        })
      const replies = await Reply.findAll({
        where: { TweetId: id },
        include: [
          { model: User, attributes: ['account', 'name', 'avatar'] }
        ],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      replies.forEach((reply) => {
        reply.repliedUserName = reply.User?.name
        reply.repliedUserAccount = reply.User?.account
        reply.repliedUserAvatar = reply.User?.avatar
        reply.tweetUserName = tweet.User?.name
        reply.tweetUserAccount = tweet.User?.account
        reply.tweetUserAvatar = tweet.User?.avatar
        delete reply.User
        getLastUpdated(reply)
      })
      return res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  postReply: (req, res, next) => {
    const TweetId = req.params.id
    const { comment } = req.body
    if (!comment) return res.status(400).json('Comment should not be empty')
    if (comment.length > 140) {
      return res.status(400).json('Comment should not be more than 140 characters')
    }

    return Reply.create({
      UserId: req.user.id || getUser(req).dataValues.id,
      TweetId,
      comment
    })
      .then(() => res.status(200).json('Create success'))
      .catch((error) => next(error))
  },
  putReply: (req, res, next) => {
    const { id } = req.params
    const { comment } = req.body
    if (!id) return res.status(400).json('Reply id is necessary')
    if (!comment) return res.status(400).json('Comment can not be empty')
    if (comment.length > 140) {
      return res.status(400).json('Comment should not be more than 140 characters')
    }

    return Reply.findOne({ where: { id } })
      .then((reply) => {
        if (req.user.id !== reply.UserId) {
          return res.status(400).json('You can only edit your own reply')
        }
        reply.comment = comment
        return reply.save()
      })
      .then((reply) => res.status(200).json('update success'))
      .catch((error) => next(error))
  },
  deleteReply: (req, res, next) => {
    const { id } = req.params
    if (!id) return res.status(400).json('Reply id is necessary')

    return Reply.findOne({ where: { id } })
      .then((reply) => {
        if (req.user.id !== reply.UserId) {
          return res.status(400).json('You can only delete your own reply')
        }
        return reply.destroy()
      })
      .then(() => res.status(200).json('delete successfully'))
      .catch((error) => next(error))
  }
}

module.exports = replyController
