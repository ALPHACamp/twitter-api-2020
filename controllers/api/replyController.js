const db = require('../../models')
const Reply = db.Reply
const replyService = require('../../services/replyService')

const replyController = {
  postReply: (req, res) => {
    replyService.postReply(req, res, (data) => {
      return res.json(data)
    })
  },
  getReplies: (req, res) => { }
}

module.exports = replyController