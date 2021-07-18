const RequestError = require('../libs/RequestError')
const db = require('../models')
const { User, Message, Sequelize } = db
const { Op } = Sequelize

const messageService = {
  saveMessage: (msg) => {
    if (!msg.content) {
      throw new RequestError('Empty input, no msg to save')
    }
    if (!msg.id) {
      throw new RequestError('Save message failed, login to send message')
    }
    let concat = ''
    if (msg.listenerId) {
      if (msg.id < msg.listenerId) {
        concat = `${msg.id}n${msg.listenerId}`
      } else {
        concat = `${msg.listenerId}n${msg.id}`
      }
    }
    return Message.create({
      UserId: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      updatedAt: msg.createdAt,
      roomId: msg.listenerId ? concat : null,
      isRead: msg.isInRoom
    }).then(message => {
      message = message.toJSON()
      message.id = message.UserId
      delete message.UserId

      return message
    })
  },

  getMessages: async (socket, msg = {}, isPrivate = false) => {
    let whereClause = {}
    let concat = ''
    if (msg.listenerId) {
      if (msg.id < msg.listenerId) {
        concat = `${msg.id}n${msg.listenerId}`
      } else {
        concat = `${msg.listenerId}n${msg.id}`
      }
    }
    switch (isPrivate) {
      case true:
        whereClause = { roomId: concat }
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
      return msg
    })
  },

  searchUnread: (io, socket, msg) => {
    return Message.findAll({
      where: {
        isRead: false,
        UserId: msg.id
      }
    }).then(msg => { return msg.length })
  },

  clearUnread: (io, socket, msg) => {
    let firstId
    let secondId
    if (msg.id > msg.listenerId) {
      firstId = msg.listenerId
      secondId = msg.id
    } else if (msg.id < msg.listenerId) {
      firstId = msg.id
      secondId = msg.listenerId
    }

    return Message.update({ isRead: true }, {
      where: {
        [Op.and]: [
          { UserId: msg.listenerId },
          { RoomId: `${firstId}n${secondId}` }
        ]
      }
    })
  },

  getChattedUsers: (io, socket, msg) => {

  },
}

module.exports = messageService
