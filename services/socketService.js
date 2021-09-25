const { Message, User, Sequelize } = require('../models')

const socketService = {
  getUser: async (userId, next) => {
    try {
      const data = await User.findByPk(userId, { attributes: ['id', 'account', 'name', 'avatar'] })

      return data.toJSON()
    } catch (error) {
      next(error)
    }
  },
  storeMessage: async (message, next) => {
    try {
      await Message.create({
        UserId: message.userId,
        roomId: message.roomId,
        content: message.content
      })
    } catch (error) {
      next(error)
    }
  },
  getMessages: async (roomId) => {
    return await Message.findAll({
      where: { roomId },
      include: { model: User, attributes: ['id', 'name', 'avatar', 'account'] },
      attributes: [
        'content',
        'createdAt'
      ],
      order: [['createdAt', 'ASC']]

    })
  }
}

module.exports = socketService
