const messageService = require('../../services/messageService')

const messageController = {
  getMessages: (req, res) => {
    messageService.getMessages(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = messageController
