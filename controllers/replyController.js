const helpers = require('../_helpers')

const db = require('../models')
const Reply = db.Reply
const User = db.User
const Tweet = db.Tweet

const replyController = {
  readReplies: (req, res, next) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          return res.status(404).json({ status: 'failure', message: 'this tweet not exist' })
        } else {
          let whereQuery = {}
          whereQuery.TweetId = req.params.id
          return Reply.findAll({ order: [['createdAt', 'DESC']], where: whereQuery, include: User })
            .then(replies => {
              return res.json(replies)
            })
            .catch(next)
        }
      })
      .catch(next)
  },
  postReply: (req, res, next) => {
    const { comment } = req.body
    if (!req.body.comment) {
      return res.status(400).json({ status: 'failure', message: "number of the words can't be less than 1" })
    } else {
      return Tweet.findByPk(req.params.id)
        .then(tweet => {
          if (!tweet) {
            return res.status(404).json({ status: 'failure', message: 'this tweet not exist' })
          } else {
            return Reply.create({
              comment,
              TweetId: req.params.id,
              UserId: helpers.getUser(req).id
            })
              .then(reply => {
                return res.json({ status: 'success', message: 'OK', reply })
              })
              .catch(next)
          }
        })
        .catch(next)
    }
  }
}

module.exports = replyController
