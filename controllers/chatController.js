const chatService = require('../services/chatService')

const chatController = {
  getHistoryChat: async (req, res, next) => {
    try {
      const data = await chatService.getHistoryChat()
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = chatController
