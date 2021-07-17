const RequestError = require('../libs/RequestError')
const db = require('../models')
const Message = db.Message

const messageController = {
  saveMessage: (socket, msg) => {
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
