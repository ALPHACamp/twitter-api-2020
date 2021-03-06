const db = require('../../models')
const Reply = db.Reply
const replyService = require('../../services/replyService')

const replyController = {
  postReply: (req, res) => {
    replyService.postReply(req, res, (data) => {
      if (data.status === 'error') return res.status(data.statusCode).json(data)
      return res.json(data)
    })
  },
  getReplies: (req, res) => {
    replyService.getReplies(req, res, (data) => {
      if (data.status === 'error') return res.status(data.statusCode).json(data)
      return res.json(data)
    })
  }
}

module.exports = replyController