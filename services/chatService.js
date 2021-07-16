const { Chat, User, Member, Room, Sequelize } = require('../models')
const { Op } = Sequelize

const chatService = {
  joinPublicChat: async (roomId = null) => {
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
  },

  joinPrivateChat: async (a, b) => {
    return await Member.findAll({
      attributes: ['RoomId', 'UserId', [Sequelize.literal('COUNT(UserId) OVER(partition by RoomId)'), 'people']]
    })
  }
}

module.exports = chatService
