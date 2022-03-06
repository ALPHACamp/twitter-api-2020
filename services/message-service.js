const { Message, User } = require('../models')
const { Op } = require('sequelize');

const messageServices = {
  saveMessages: async (message) => {
    console.log(message)
    return await Message.create({
      UserId: message.userId,
      content: message.text,
      roomId: message.roomId
    })
  },
  getMessages: async roomId => {
    const messages = await Message.findAll({
      where: { roomId },
      include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
      attributes: ['content', 'createdAt'],
      order: [['createdAt', 'ASC']]
    })
    return messages
  },
  privateMessages: async (userId, roomId) => {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ UserId: userId }, { receiverId: userId }], //or
        roomId
      },
      order: [['createdAt', 'ASC']]
    })

    const set = new Set()
    let result = messages.filter(i => set.has(i.roomId) ? false : set.add(i.roomId))

    return result
  }
}

module.exports = messageServices