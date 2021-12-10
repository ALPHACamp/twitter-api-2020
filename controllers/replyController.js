// 載入所需套件
const replyService = require('../services/replyService')

const replyController = {
  postReply: async (req, res) => {
    try {
      await replyService.postReply(req, res, data => {
        return res.json(data)
      })
    } catch (err) {
      return res.status(400).json({ status: err.name, message: err.message })
    }
  },

  getReplies: (req, res) => {
    replyService.getReplies(req, res, data => {
      return res.json(data)
    })
  }
}

// replyService exports
module.exports = replyController