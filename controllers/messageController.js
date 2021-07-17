const db = require('../models')
const Message = db.Message

const messageController = {
  saveMessage: (socket, msg) => {
    return Message.create({
      UserId: socket.data.id,
      content: msg
    })
  },

  getMessages: () => {

  }
}

module.exports = messageController
