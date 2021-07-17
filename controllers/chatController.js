const chatService = require('../services/chatService')

const chatController = {
  joinPublicChat: async (req, res, next) => {
    try {
      const data = await chatService.joinPublicChat()
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },

  getPrivateChatList: async (req, res, next) => {
    try {
      const data = await chatService.getPrivateChatList(req.user.id)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = chatController
