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
    }).then(message => {
      message = message.toJSON()
      message.id = message.UserId
      delete message.UserId

      return message
    })
  },

  getMessages: async (socket, isPrivate = false) => {
    let whereClause = {}
    switch (isPrivate) {
      case true:
        // whereClause = { RoomId:  }
        break
      case false:
        whereClause = { RoomId: null }
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
      return msg
    })
  },

  searchUnread: (io, socket, msg) => {

  },

  clearUnread: (io, socket, msg) => {

  },

  getChattedUsers: (io, socket, msg) => {

  },
}

module.exports = messageService
