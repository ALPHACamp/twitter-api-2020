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
          return res.status(404).json({ status: 'failure', message: 'this tweet not exist' })
        }
        if (tweet.Replies.length < 1) {
          return res.status(404).json({ status: 'failure', message: "this tweet doesn't have any reply" })
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
      return res.status(400).json({ status: 'failure', message: "number of the words can't be less than 1" })
    }
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          return res.status(404).json({ status: 'failure', message: 'this tweet not exist' })
        }
        return Reply.create({
          comment,
          TweetId: req.params.id,
          UserId: helpers.getUser(req).id
        })
          .then(reply => {
            return res.json({ status: 'success', message: 'OK', reply })
          })
          .catch(next)
      })
      .catch(next)
  },
  updateReply: (req, res, next) => {
    const { comment } = req.body
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          return res.status(404).json({ status: 'failure', message: 'tweet not exist' })
        }
        return Reply.findByPk(req.params.replyId)
          .then(reply => {
            if (!reply) {
              return res.status(404).json({ status: 'failure', message: 'reply not exist' })
            }
            if (reply.UserId !== helpers.getUser(req).id) {
              return res.status(401).json({ status: 'failure', message: 'permission denied' })
            }
            if (!comment) {
              return res.status(400).json({ status: 'failure', message: "comment didn't exist" })
            }
            return reply
              .update({ comment: comment })
              .then(reply => {
                res.json({ status: 'success', message: 'Reply is updated successfully', reply })
              })
              .catch(next)
          })
          .catch(next)
      })
      .catch(next)
  }
}

module.exports = replyController
