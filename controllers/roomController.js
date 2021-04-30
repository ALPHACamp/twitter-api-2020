const db = require('../models')
const ChatRoom = db.ChatRoom
const JoinRoom = db.JoinRoom
const User = db.User
const Message = db.Message
const helpers = require('../_helpers')
const { countUsers, users } = require('../utils/users')

const { generateMessage } = require('../utils/message')

const roomController = {
  getPublicRoom: async (req, res, next) => {
    try {
      // 如果用 GET /public 要怎麼埋資料傳給我？ 還要跟前端確認下

      // 取到了目前在線名單，userId 不重複
      const { roomId } = req.body
      const UserId = req.user.id
      // console.log('users:', users)

      // 取目前在線名單，userId 不重複，也不包括自己
      const set = new Set()
      const onlineUsers = await users.filter(user => {
        if (user.userId !== UserId) {
          return !set.has(user.userId) ? set.add(user.userId) : false
        }
      })
      // console.log('onlineUsers:', onlineUsers)

      // 取目前在線的使用者們的 id
      const userIds = await onlineUsers.map(user => {
        return user.userId
      })
      // console.log('userIds:', userIds)
      const onlineUserData = await User.findAll({
        raw: true,
        nest: true,
        where: { id: userIds }
      })

      // 過去在這間公開聊天室的所有訊息內容
      const messages = await Message.findAll({
        raw: true,
        nest: true,
        where: { ChatRoomId: roomId }
      })

      // 要回傳的資料
      return res
        .status(200)
        .json({
          onlineUsersCount: onlineUsers.length,
          onlineUsers: onlineUserData,
          messages
        })
    }
    catch (error) {
      next(error)
    }
  },
  createRoom: async (req, res, next) => { },
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
