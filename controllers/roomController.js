const db = require('../models')
const ChatRoom = db.ChatRoom
const JoinRoom = db.JoinRoom
const User = db.User
const Message = db.Message
const helpers = require('../_helpers')
const { countUsers, users } = require('../utils/users')

const { generateMessage } = require('../utils/message')
const { Sequelize, sequelize } = require('../models')
const { Op } = Sequelize

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
  },
  // 要抓取還沒跟這個人聊過天的 的名單
  getAvailableUsers: async (req, res, next) => {
    try {
      // 因為沒有改變資料結構，一個聊天室有兩筆資料(user A && user B)，因此撈資料都需要在同一 table 撈兩次來過濾
      let existingChats = await JoinRoom.findAll({
        raw: true,
        nest: true,
        where: {
          UserId: helpers.getUser(req).id
        },
        attributes: ['ChatRoomId']
      })

      existingChats = await existingChats.map(chat => {
        return chat.ChatRoomId
      })
      // console.log('existingChats:', existingChats)

      let myChats = await JoinRoom.findAll({
        raw: true,
        nest: true,
        where: {
          ChatRoomId: existingChats,
          UserId: {
            $notLike: helpers.getUser(req).id
          }
        },
        attributes: ['UserId']
      })

      // console.log('myChats:', myChats)

      myChats = myChats.map(chat => {
        return chat.UserId
      })

      myChats.push(helpers.getUser(req).id, 1) // 排除掉自己與 admin

      // console.log(myChats)

      // 先抓所有使用者，並排除自己
      const users = await User.findAll({
        raw: true,
        nest: true,
        where: {
          id: {
            $notIn: myChats
          }
        }
      })

      // console.log('users:', users)

      if (!users) {
        return res.status(200).json({
          status: 'error',
          message: 'All users are in existing chats',
          availableUsers: null
        })
      }

      const availableUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        account: user.account,
        avatar: user.avatar
      }))

      return res.status(200).json(availableUsers)
    } catch (error) {
      next(error)
    }
  },
  getRoomsByUser: async (req, res, next) => {
    try {
      const currentUserId = req.user.id
      let joinedRooms = await JoinRoom.findAll({
        raw: true,
        nest: true,
        attributes: ['ChatRoomId'],
        where: { UserId: helpers.getUser(req).id, ChatRoomId: { $not: 4 } }
      })
      joinedRooms = joinedRooms.map(room => room.ChatRoomId)

      let messages = await sequelize.query(
        `
        SELECT *            
        FROM (
        SELECT ChatRoomId AS cid, MAX(id) AS id
        FROM Messages
        WHERE ChatRoomId IN (:chatRoomIds)
        group by ChatRoomId
        ) AS m2
        LEFT JOIN Messages AS m1
        ON m1.id = m2.id
        LEFT JOIN ChatRooms 
        ON ChatRooms.id = m2.cid
        JOIN JoinRooms AS j1
        ON j1.ChatRoomId = ChatRooms.id
        LEFT JOIN Users 
        ON j1.UserId = Users.id
        WHERE j1.UserId <> (:currentUserId);
      `,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { chatRoomIds: joinedRooms, currentUserId }
        }
      )

      messages = messages.map(message => {
        return {
          userId: message.UserId,
          name: message.name,
          account: message.account,
          avatar: message.avatar,
          roomId: message.cid,
          message: message.message,
          createdAt: message.createdAt
        }
      })

      res.status(200).json(messages)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = roomController
