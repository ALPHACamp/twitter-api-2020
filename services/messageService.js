const RequestError = require('../libs/RequestError')
const db = require('../models')
const User = db.User
const Message = db.Message

const messageService = {
  saveMessage: (msg) => {
    if (!msg.content) {
      throw new RequestError('Empty input, no msg to save')
    }
    if (!msg.id) {
      throw new RequestError('Save message failed, login to send message')
    }
    return Message.create({
      UserId: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      updatedAt: msg.createdAt
    })
  },

  getMessages: (socket, isPrivate) => {
    let whereClause = {}
    switch (isPrivate) {
      case true:
        // whereClause = { roomId:  }
        break
      case false:
        whereClause = { roomId: null }
        break
    }
    return Message.findAll({
      where: whereClause,
      order: [['createdAt', 'ASC']],
      include: { model: User }
    }).then(msg => {
      msg = msg.map((msg, i) => {
        const mapItem = {
          id: msg.dataValues.UserId,
          avatar: msg.dataValues.User.dataValues.avatar,
          content: msg.dataValues.content,
          createdAt: msg.dataValues.createdAt
        }
        return mapItem
      })
      socket.emit('get messages', msg)
    })
  }
}

module.exports = messageService
