const { Message, User } = require('../models')

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
  }
}

module.exports = messageServices