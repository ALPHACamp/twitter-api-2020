const replyServices = require('../services/reply-services')

const replyController = {
  getReplies: (req, res, next) => {
    replyServices.signIn(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  postReplies: (req, res, next) => {
    replyServices.getUsers(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
}

module.exports = replyController