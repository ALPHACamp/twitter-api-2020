const db = require('../models')
const ChatRoom = db.ChatRoom
const User = db.User
const helpers = require('../_helpers')

const { generateMessage } = require('../utils/message')

const roomController = {
  createRoom: async (req, res, next) => {},
  sendMessage: async (req, res, next) => {
    const roomId = req.params.roomId
    const message = req.body.message
    global.io.sockets.in(roomId).emit('chat message', generateMessage(message))
  }
}

module.exports = roomController
