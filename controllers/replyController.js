const helpers = require('../_helpers')

const db = require('../models')
const Reply = db.Reply
const User = db.User
const Tweet = db.Tweet

const replyController = {
  readReplies: (req, res, next) => {
    Tweet.findByPk(req.params.id, {
      include: { model: Reply, include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }] },
      order: [['createdAt', 'DESC']]
    })
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json({ message: 'this tweet not exist' })
        }
        replies = tweet.Replies.map(reply => ({
          ...reply.dataValues,
          isSelf: reply.UserId === helpers.getUser(req).id
        }))
        return res.json(replies)
      })
      .catch(next)
  },
  postReply: (req, res, next) => {
    const { comment } = req.body
    if (!comment) {
      return res.status(400).json({ message: "number of the words can't be less than 1" })
    }
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json({ message: 'this tweet not exist' })
        }
        return Reply.create({
          comment,
          TweetId: req.params.id,
          UserId: helpers.getUser(req).id
        }).then(reply => {
          return res.json({ status: 'success', message: 'OK', reply })
        })
      })
      .catch(next)
  },
  updateReply: (req, res, next) => {
    const { comment } = req.body
    Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json({ message: 'tweet not exist' })
        }
        return Reply.findByPk(req.params.replyId).then(reply => {
          if (!reply) {
            return res.status(400).json({ message: 'reply not exist' })
          }
          if (reply.UserId !== helpers.getUser(req).id) {
            return res.status(403).json({ message: 'permission denied' })
          }
          if (!comment) {
            return res.status(400).json({ message: "number of words can't be less than 1" })
          }
          return reply.update({ comment: comment }).then(reply => {
            res.json({ status: 'success', message: 'Reply is updated successfully', reply })
          })
        })
      })
      .catch(next)
  },
  deleteReply: (req, res, next) => {
    Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json({ message: 'tweet not exist' })
        }
        return Reply.findByPk(req.params.replyId).then(reply => {
          if (!reply) {
            return res.status(400).json({ message: 'reply not exist' })
          }
          if (reply.UserId !== helpers.getUser(req).id) {
            return res.status(403).json({ message: 'permission denied' })
          }
          return reply.destroy().then(reply => {
            res.json({ status: 'success', message: 'Reply is delete successfully', reply })
          })
        })
      })
      .catch(next)
  }
}

module.exports = replyController
