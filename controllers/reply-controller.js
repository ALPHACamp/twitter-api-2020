const replyServices = require('../services/reply-services')

const replyController = {
  getReplies: (req, res, next) => {
    replyServices.getReplies(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  postReplies: (req, res, next) => {
    replyServices.postReplies(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
}

module.exports = replyController