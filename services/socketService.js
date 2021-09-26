const { Message, User, Sequelize } = require('../models')
const { Op } = require('sequelize')

const socketService = {
  getUser: async (userId, next) => {
    try {
      const data = await User.findByPk(userId, { attributes: ['id', 'account', 'name', 'avatar'] })

      return data.toJSON()
    } catch (error) {
      next(error)
    }
  },
  storeMessage: async (message, userId, next) => {
    try {
      await Message.create({
        UserId: userId,
        roomId: message.roomId,
        receiverId: message.receiverId,
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
  },
  getPrivateMessages: async (UserId) => {
    const data = await Message.findAll({ 
      raw: true, 
      nest: true,
      where: { [Op.or]: [{ UserId: UserId}, {receiverId: UserId }],
        roomId: {
          [Op.ne]: 1
        }},
      order: [['createdAt', 'DESC']]
    })

    const set = new Set()
    let result = data.filter(i => !set.has(i.roomId)?set.add(i.roomId):false)
    for (const i of result) {
      if (UserId === i.UserId) {
        i.user = await User.findByPk(i.receiverId, { attributes: ['id', 'account', 'name', 'avatar'] })
      }
      i.user = await User.findByPk(i.UserId, { attributes: ['id', 'account', 'name', 'avatar'] })
    }

    return result
  }
}

module.exports = socketService

