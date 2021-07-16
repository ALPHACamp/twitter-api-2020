const { Chat } = require('../models')

const chatService = {
  getHistoryChat: async (roomId = null) => {
    return await Chat.findAll({
      where: { room: roomId },
      order: [['createdAt', 'DESC']]
    })
  },

  postChat: async (chatData) => {
    return await Chat.bulkCreate(chatData)
  }
}

module.exports = chatService
