const db = require('../models')
const ChatRoom = db.ChatRoom
const User = db.User
const Message = db.Message
const helpers = require('../_helpers')
const { countUsers } = require('../utils/users')

const { generateMessage } = require('../utils/message')

const roomController = {
  createRoom: async (req, res, next) => {},
  sendMessage: async (req, res, next) => {
    const roomId = req.params.roomId
    const message = req.body.message
    global.io.sockets.in(roomId).emit('chat message', generateMessage(message))
  },
  sendPublicMessage: async (req, res, next) => {

    try {
      // Message can not be empty
      if (!req.body.message.trim()) {
        return res.status(422).json({
          status: 'error',
          message: 'Message is empty.'
        })
      }

      const message = await Message.create({
        UserId: helpers.getUser(req).id,
        ChatRoomId: req.body.roomId,
        message: req.body.message
      })

      if (!message) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error.'
        })
      }

      global.io.sockets
        .in(req.body.roomId)
        .emit('chat message', generateMessage(message.message))

      res.status(200).json({
        status: 'success',
        message
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = roomController
