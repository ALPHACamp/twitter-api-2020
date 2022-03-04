const { Message } = require('../models')

const messageServices = {
  saveMessages: async (message, userId, next) => {
    try {
      return await Message.create({
        UserId: userId,
        content: message.content,
        roomId: message.roomId
      })
    } catch (err) {
      next(err)
    }
  },
  getMessages: async roomId => {
    const messages = await Message.findAll({
      where: { roomId },
      include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
      attributes: ['content', 'createdAt'],
      order: ['createdAt', 'DESC']
    })

    return messages
  }
}

module.exports = messageServices