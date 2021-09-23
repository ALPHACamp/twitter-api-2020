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
  }
}

module.exports = messageService
