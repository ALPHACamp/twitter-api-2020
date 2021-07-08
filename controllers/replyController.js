const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')

let replyController = {
  postReply: (req, res, next) => {
    if (!req.body.comment) {
      res.json({ status: 'error', message: "comment didn't exist" })
      return res.redirect('back')
    }
    return Reply.create({
      comment: req.body.comment,
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweetId,
    })
      .then((reply) => {
        res.json(reply)
      })
      .catch((err) => next(err))
  },

  getReply: (req, res, next) => {
    Reply.findAll({ where: { TweetId: req.params.tweetId } }, { include: { model: User } })
      .then((reply) => {
        res.json(reply)
      })
      .catch((err) => next(err))
  },
}

module.exports = replyController
