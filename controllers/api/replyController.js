const db = require('../../models')
const replyService = require('../../services/replyService.js')

let replyController = {
  postReply: (req, res) => {
    replyService.postReply(req, res, (data) => {
      return res.json(data)
    })
  },
  getReplies: (req, res) => {
    replyService.getReplies(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = replyController