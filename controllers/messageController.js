const RequestError = require('../libs/RequestError')
const db = require('../models')
const Message = db.Message

const messageController = {
  saveMessage: (socket, msg) => {
    if (!msg) {
      throw new RequestError('Empty input, no msg to save')
    }
    if (!socket.data.id) {
      throw new RequestError('Save message failed, login to send message')
    }
    return Message.create({
      UserId: socket.data.id,
      content: msg
    })
  },

  getMessages: (socket, isPrivate) => {
    let whereClause = {}
    isPrivate = false
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
      order: [['createdAt', 'ASC']]
    }).then(msg => {
      socket.emit('get messages', msg)
    })
  }
}

module.exports = messageController
