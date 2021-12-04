const replyService = require('../../services/replyService')

const replyController = {
  postReply: (req, res) => {
    replyService.postReply(req, res, data => {
      return res.json(data)
    })
  },

  getReply: (req, res) => {
    replyService.getReply(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = replyController
