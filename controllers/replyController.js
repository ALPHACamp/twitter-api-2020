const helpers = require('../_helpers')

const db = require('../models')
const Reply = db.Reply

const replyController = {
  readReplies: (req, res) => {},
  postReply: (req, res, next) => {
    const { comment } = req.body
    if (!req.body.comment) {
      return res.status(400).json({ status: 'failure', message: "number of the words can't be less than 1" })
    } else {
      Reply.create({
        comment,
        TweetId: req.params.id,
        UserId: helpers.getUser(req).id
      })
        .then(reply => {
          return res.json({ status: 'success', message: 'OK', reply })
        })
        .catch(next)
    }
  }
}

module.exports = replyController
