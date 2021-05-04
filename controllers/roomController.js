const db = require('../models')
const ChatRoom = db.ChatRoom
const JoinRoom = db.JoinRoom
const User = db.User
const Message = db.Message
const Notification = db.Notification
const Tweet = db.Tweet
const Reply = db.Reply
const helpers = require('../_helpers')
const { countUsers, users } = require('../utils/users')

const { generateMessage } = require('../utils/message')
const { Sequelize, sequelize } = require('../models')
const { Op } = Sequelize

const publicRoom = 4

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
      console.log('==== POST /api/rooms ====')
      console.log('req.body.userId', req.body.userId)
      console.log('req.body', req.body)

      const currentUserId = req.user.id
      const otherUserId = req.body.userId

      const checkRoom = await sequelize.query(
        `
        SELECT j1.ChatRoomId
        FROM JoinRooms j1
        INNER JOIN JoinRooms j2
        ON j1.ChatRoomId = j2.ChatRoomId
        WHERE j1.UserId <> j2.UserId AND j1.UserId = (:otherUserId) AND j2.UserId = (:currentUserId) AND j2.ChatRoomId <> (:publicRoom);
      `,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: {
            currentUserId,
            otherUserId,
            publicRoom
          }
        }
      )

      console.log('checkRoom', checkRoom)

      if (checkRoom.length) {
        await JoinRoom.update(
          { createdAt: Date.now(), updatedAt: Date.now() },
          {
            where: {
              UserId: [currentUserId, otherUserId],
              ChatRoomId: checkRoom[0].ChatRoomId
            }
          }
        )
        return res.status(200).json({
          status: 'success',
          roomId: checkRoom[0].ChatRoomId
        })
      }

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
  getAvailableUsers: async (req, res, next) => {
    try {
      const currentUserId = req.user.id

      const users = await sequelize.query(
        `
        SELECT *
        FROM Users
        WHERE id not in (
        SELECT j1.UserId
        FROM JoinRooms j1
        INNER JOIN JoinRooms j2
        ON j1.ChatRoomId = j2.ChatRoomId
        INNER JOIN (
        SELECT ChatRoomId AS cid, MAX(id) AS id
        FROM Messages
        GROUP BY ChatRoomId
        ) AS msg
        ON msg.cid = j1.ChatRoomId
        WHERE j1.UserId <> j2.UserId AND j1.UserId <> (:currentUserId) AND j2.UserId = (:currentUserId) AND j2.ChatRoomId <> (:publicRoom)
        ) 
        AND role = 'user'
      `,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { currentUserId, publicRoom }
        }
      )

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
        where: {
          UserId: helpers.getUser(req).id,
          ChatRoomId: { $not: publicRoom }
        }
      })
      joinedRooms = joinedRooms.map(room => room.ChatRoomId)

      if (!joinedRooms.length) {
        return res.status(200).json([])
      }

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

      if (!messages.length) {
        let chatAttendee = await JoinRoom.findAll({
          raw: true,
          nest: true,
          where: {
            ChatRoomId: joinedRooms,
            UserId: {
              $notLike: helpers.getUser(req).id
            }
          },
          include: [User]
        })
        chatAttendee = chatAttendee.map(user => {
          return {
            userId: user.UserId,
            name: user.User.name,
            account: user.User.account,
            avatar: user.User.avatar,
            roomId: user.ChatRoomId,
            message: null,
            createdAt: null
          }
        })
        return res.status(200).json(chatAttendee)
      }

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
  },
  countUnreadMsg: async (req, res, next) => {
    try {
      const currentUserId = req.user.id
      let joinedRooms = await JoinRoom.findAll({
        raw: true,
        nest: true,
        attributes: ['ChatRoomId'],
        where: {
          UserId: helpers.getUser(req).id,
          ChatRoomId: { $not: publicRoom }
        }
      })
      joinedRooms = joinedRooms.map(room => room.ChatRoomId)

      let unreads = await sequelize.query(
        `
        SELECT m1.id           
        FROM Messages AS m2
        LEFT JOIN Messages AS m1
        ON m1.id = m2.id
        LEFT JOIN ChatRooms 
        ON ChatRooms.id = m2.ChatRoomId
        JOIN JoinRooms AS j1
        ON j1.ChatRoomId = ChatRooms.id
        LEFT JOIN Users 
        ON j1.UserId = Users.id
        WHERE m2.createdAt > j1.updatedAt AND j1.UserId = ((:currentUserId)) AND m1.ChatRoomId IN (:chatRoomIds);
      `,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { chatRoomIds: joinedRooms, currentUserId }
        }
      )
      res.status(200).json(unreads.length)
    } catch (error) {
      next(error)
    }
  },

  getNotifications: async (req, res, next) => {
    try {
      let notifications = await Notification.findAll({
        raw: true,
        nest: true,
        where: { otherUserId: helpers.getUser(req).id },
        include: [User, Tweet, Reply],
        order: [['updatedAt', 'DESC']]
      })
      // console.log(notifications)

      if (!notifications) {
        return res.json(null)
      }

      notifications = notifications.map(el => ({
        userId: el.UserId,
        name: el.User.name,
        avatar: el.User.avatar,
        tweetId: el.Tweet.id,
        tweet: el.Tweet.description,
        replyId: el.Reply.id,
        reply: el.Reply.comment,
        type: el.type
      }))
      return res.status(200).json(notifications)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = roomController
