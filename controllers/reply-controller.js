const replyServices = require('../services/reply-services')

const replyController = {
  getReplies: (req, res, next) => {
    replyServices.getReplies(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  postReply: (req, res, next) => {
    replyServices.postReply(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}

module.exports = replyController
