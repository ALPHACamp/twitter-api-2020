const db = require('../models')
const ChatRoom = db.ChatRoom
const JoinRoom = db.JoinRoom
const User = db.User
const Message = db.Message
const helpers = require('../_helpers')
const { countUsers, users } = require('../utils/users')

const { generateMessage } = require('../utils/message')

const roomController = {
  getRoom: async (req, res, next) => {
    try {
      const roomId = req.params.roomId
      const UserId = req.user.id

      // 取目前在線名單，userId 不重複，也不包括自己
      const set = new Set()
      const onlineUsers = await users.filter(user => {
        if (user.userId !== UserId) {
          return !set.has(user.userId) ? set.add(user.userId) : false
        }
      })

      const onlineUserData = await User.findAll({
        raw: true,
        nest: true,
        where: { id: [...set] }
      })

      const usersData = onlineUserData.map(user => ({
        id: user.id,
        name: user.name,
        account: user.account,
        avatar: user.avatar
      }))

      // 過去在這間公開聊天室的所有訊息內容
      const messages = await Message.findAll({
        raw: true,
        nest: true,
        include: [User],
        where: { ChatRoomId: roomId },
        order: [['createdAt', 'ASC']]
      })

      const messageData = messages.map(message => ({
        id: message.id,
        avatar: message.User.avatar,
        UserId: message.UserId,
        message: message.message,
        createdAt: message.createdAt
      }))

      return res.status(200).json({
        onlineUsersCount: onlineUsers.length + 1,
        onlineUsers: usersData,
        messages: messageData
      })
    } catch (error) {
      next(error)
    }
  },

  createRoom: async (req, res, next) => {
    try {
      const newRoom = await ChatRoom.create({ isPublic: false })
      await JoinRoom.bulkCreate([
        { UserId: req.user.id, ChatRoomId: newRoom.id },
        { UserId: req.body.userId, ChatRoomId: newRoom.id }
      ])
      res.status(200).json({
        status: 'success',
        roomId: newRoom.id
      })
    } catch (error) {
      next(error)
    }
  },

  sendMessage: async (req, res, next) => {
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
        ChatRoomId: req.params.roomId,
        message: req.body.message
      })

      if (!message) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error.'
        })
      }

      global.io.sockets
        .in(req.params.roomId)
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
