const replyServices = require('../../services/reply-services')

const replyController = {
  getReplies: (req, res, next) => {
    // tweetServices.getTweets(req, (err, data) => err ? next(err) : res.json(data))
    replyServices.getReplies(req, (err, data) => {
      if (err) {
        return next(err)
      }
      return res.status(200).json(data)
    })
  },
  postReply: (req, res, next) => {
    replyServices.postReply(req, (err, data) => {
      if (err) {
        return next(err)
      }
      return res.status(200).json(data)
    })
  }

}

module.exports = replyController
