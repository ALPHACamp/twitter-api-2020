const { Chat, User } = require('../models')

const chatService = {
  getHistoryChat: async (roomId = null) => {
    return await Chat.findAll({
      attributes: ['id', 'text', 'createdAt'],
      where: { room: roomId },
      include: [
        { model: User, attributes: ['id', 'name', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']]
    })
  },

  postChat: async (chatData) => {
    try {
      return await Chat.create(chatData)
    } catch (error) {
      return error.message
    }
  }
}

module.exports = chatService
