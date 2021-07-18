const chatService = require('../services/chatService')

const chatController = {
  getHistoryChat: async (req, res, next) => {
    try {
      const data = await chatService.getHistoryChat()
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },

  getPrivateChat: async (req, res, next) => {
    try {
      const data = await chatService.getHistoryChat(req.params.room_id)
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
