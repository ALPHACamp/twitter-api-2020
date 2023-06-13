const replyServices = require('../services/reply-service')

const replyController = {
  postComment: (req, res, next) => {
    replyServices.postComment(req, (err, data) => err ? next(err) : res.json(data))
  },
  getComment: (req, res, next) =>{
    replyServices.getComment(req, (err, data) => err ? next(err) : res.json(data.reply))
  }
}  

module.exports = replyController