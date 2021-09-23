const { Message, Room, Member, User } = require('../models')

const messageService = {
  postMessage: async (message) => {
    const { UserId, RoomId, content } = message
    await Message.create({
      UserId,
      RoomId,
      content
    })

    return res.status(200).json({
      status: 'success',
      message: 'A message has created'
    })
  },

  getMessages: async (room) => {
    const { RoomId } = room
    return await Message.findAll({
      where: { RoomId },
      include: [
        { model: User, attributes: ['id', 'name', 'avatar', 'account'] }
      ],
      order: [['createdAt', 'ASC']]
    })
  }
}

module.exports = messageService
