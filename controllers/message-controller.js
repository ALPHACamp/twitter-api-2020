const messageService = require('../services/message-service')
const helpers = require('../_helpers')

const messageController = {
  getMessages: async (req, res) => {
    const { roomId } = req.params
    try {
      const messages = await messageService.getMessages(roomId)

      return res.status(200).json(messages)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },
  privateMessages: async (req, res) => {
    const userId = helpers.getUser(req)
    try {
      const data = await messageService.privateMessages(userId)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  }
}

module.exports = messageController