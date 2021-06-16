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
  getSingleReply: (req, res) => {
    replyServices.getSingleReply(req, res, data => {
      return res.json(data)
    })
  },
  putReply: (req, res) => {
    replyServices.putReply(req, res, data => {
      return res.json(data)
    })
  },
  deleteReply: (req, res) => {
    replyServices.deleteReply(req, res, data => {
      return res.json(data)
    })
  }
}
module.exports = replyController