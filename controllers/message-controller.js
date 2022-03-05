const messageService = require('../services/message-service')

const messageController = {
  getMessages: async (req, res) => {
    const roomId = req.params.id
    try{
      const messages = await messageService.getMessages(roomId)

      return res.status(200).json(messages)
    } catch(err) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  }
}

module.exports = messageController