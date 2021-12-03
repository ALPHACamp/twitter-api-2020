// 載入所需套件
const replyService = require('../services/replyService')

const replyController ={
  postReply: (req, res) => {
    replyService.postReply(req, res, data => {
      return res.json(data)
    })
  }
}

// replyService exports
module.exports = replyController