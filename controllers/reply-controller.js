const replyServices = require('../services/reply-service')

const replyController = {
  postComment: (req, res, next) => {
    replyServices.postComment(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'reply was successfully created')
      req.session.createdData = data
      return res.redirect(`/tweets/${data.reply.tweetId}`)
    })
  },
  getComment: (req, res, next) =>{
    replyServices.getComment(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}  

module.exports = replyController