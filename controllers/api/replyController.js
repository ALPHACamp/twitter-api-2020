const replyService = require('../../services/replyService.js')

const replyController = {
  getReplies: (req, res) => {
    replyService.getReplies(req, res, (data) => {
      return res.json(data)
    })
  },

  getRepliesCount: (req, res) => {
    replyService.getRepliesCount(req, res, (data) => {
      return res.json(data)
    })
  },

  postReply: (req, res) => {
    replyService.postReply(req, res, (data) => {
      return res.json(data)
    })
  },

  putReply: (req, res) => {
    replyService.putReply(req, res, (data) => {
      return res.json(data)
    })
  },

  deleteReply: (req, res) => {
    replyService.deleteReply(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = replyController