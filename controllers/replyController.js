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
        return res.json(tweet.Replies)
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
  }
}

module.exports = replyController
