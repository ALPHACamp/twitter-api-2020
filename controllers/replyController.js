const replyServices = require('../services/replyServices')

const replyController = {
  postReply: (req, res) => {
    replyServices.postReply(req, res, data => {
      return res.json(data)
    })
  },
  getReply: (req, res) => {
    replyServices.getReply(req, res, data => {
      return res.json(data)
    })
  },
}
module.exports = replyController