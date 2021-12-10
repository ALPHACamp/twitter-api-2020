// 載入所需套件
const messageService = require('../services/messageService')

const messageController = {
  getPublicMessage: (req, res) => {
    messageService.getPublicMessage(req, res, data => {
      return res.json(data)
    })
  },

  getPrivateMessage: (req, res) => {
    messageService.getPrivateMessage(req, res, data => {
      return res.json(data)
    })
  }
}

// messageService exports
module.exports = messageController