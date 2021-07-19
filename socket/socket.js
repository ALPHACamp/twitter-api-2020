const sockets = [] // array of sockets  找到對應的socket物件
const socketUsers = {} // key(socketId) to value(id, name, account, avatar) 利用socketid可以找到對應使用者
const publicRoomUsers = [] // array of userIds 公開聊天室的socketId
const socketio = require('socket.io')
const db = require('../models')
const Message = db.Message
const User = db.User
const Room = db.Room
const { authenticatedSocket } = require('../middleware/auth')
const { Op } = require('sequelize')

const socketController = {
  showPublicRoomUser: (publicRoomUsers) => {
    let users = []
    publicRoomUsers.forEach((socketId) => {
      if (socketUsers[socketId]) {
        users.push(socketUsers[socketId])
      }
    })
    let allId = users.map((item) => item.id)
    users = users.filter((user, i, arr) => allId.indexOf(user.id) === i)
    return users
  },
  offlineNotices: async (currentId, lastOnlineAt) => {
    const now = new Date()
    let Rooms = await Room.findAll({
      where: {
        '$or': [
          { User1Id: currentId },
          { User2Id: currentId }
        ]
      },
      include: {
        model: Message,
        as: 'Messages',
        where: {
          createdAt: {
            '$between': [lastOnlineAt, now]
          },
        },
        attributes: ['UserId']
      }
    })
    Rooms = Rooms.map(room => {
      const { id } = room.toJSON()
      const UserId = room.Messages[0].UserId
      return {
        RoomId: id,
        UserId
      }
    })
    return { Rooms }
  },
  isUser2Oneline: (User2Id) => {
    for (socketId in socketUsers) {
      if (socketUsers[socketId].id === User2Id) {
        return socketId
      }
    }
    return false
  }
}

module.exports = (server) => {
  const io = socketio(server, {
    cors: {
      origin: ['http://localhost:8080', 'https://ryanhsun.github.io'],
      credentials: true
    },
    allowEIO3: true
  })
  io.use(authenticatedSocket).on('connection', async (socket) => {
    const currentUser = socket.request.user
    /* connect */
    // 儲存socket物件
    sockets.push(socket)
    // 建立socketId 與使用者資訊的對照表
    socketUsers[socket.id] = {
      id: currentUser.id,
      name: currentUser.name,
      account: currentUser.account,
      avatar: currentUser.avatar,
      lastOnlineAt: currentUser.lastOnlineAt
    }
    console.log(`User is online: ${socketUsers[socket.id].name} / ${socket.id}`)
    socket.emit('message', `Your socket id is  ${socket.id}`)

    // send offline notices
    const offlineNotices = await socketController.offlineNotices(currentUser.id, socketUsers[currentUser.id].lastOnlineAt)
    socket.emit('notice_when_offline', offlineNotices)
    socket.on('sendMessage', (data) => console.log(data))



    /* disconnect */
    socket.on('disconnect', () => {
      // update lastOnlineA
      const timestamp = new Date()
      const userId = socketUsers[socket.id]
      User.findById(userId).then(user => {
        user.lastOnlineAt = timestamp
        user.save()
      })

      delete socketUsers[socket.id]
      if (publicRoomUsers.includes(socket.id)) {
        publicRoomUsers.splice(publicRoomUsers.indexOf(socket.id), 1)
        const users = showPublicRoomUser(publicRoomUsers)
        io.emit('online_users', {
          users
        })
      }
      const index = sockets.findIndex((obj) => obj.id === socket.id)
      sockets.splice(index, 1)
      console.log(`User is offline: ${socket.id}`)
    })

    /* join public room */
    socket.on('join_public_room', async ({ userId }) => {
      console.log('============================')
      console.log('join_public_room: ', userId)
      console.log('加入公開的socket ID: ', socket.id)
      console.log('============================')

      publicRoomUsers.push(socket.id)
      const user = socketUsers[socket.id]
      io.emit('new_join', {
        name: user.name
      })
      const users = socketController.showPublicRoomUser(publicRoomUsers)
      io.emit('online_users', {
        users
      })
    })
    /* leave public room */
    socket.on('leave_public_room', async ({ userId }) => {
      console.log('============================')
      console.log('leave_public_room: ', userId)
      console.log('============================')

      publicRoomUsers.splice(publicRoomUsers.indexOf(socket.id), 1)
      const user = socketUsers[socket.id]
      io.emit('user_leave', {
        name: user.name
      })
      const users = socketController.showPublicRoomUser(publicRoomUsers)
      io.emit('online_users', {
        users
      })
    })

    /* get public history */
    socket.on('get_public_history', async ({ offset, limit }, cb) => {
      const options = {
        offset,
        limit,
        order: [['createdAt', 'desc']],
        include: [
          {
            model: User,
            attributes: ['avatar'],
            as: 'User'
          }
        ],
        where: {
          RoomId: 1
        }
      }
      const messages = await Message.findAll(options)
      messages.forEach((message) => {
        message.dataValues.avatar = message.dataValues.User.avatar
        delete message.dataValues.User
      })
      cb(messages)
    })

    /* public message */
    socket.on('post_public_msg', async ({ content, userId }) => {
      console.log('============================')
      console.log('post_public_msg: ', { content, userId })
      console.log('============================')
      if (!content) {
        return
      }
      const message = await Message.create({
        RoomId: 1,
        UserId: userId,
        content
      })
      const user = socketUsers[socket.id]
      socket.broadcast.emit('get_public_msg', {
        content: message.content,
        createdAt: message.createdAt,
        avatar: user.avatar
      })
    })

    /* privacy message */
    socket.on('join_private_room', async ({ User1Id, User2Id }, callback) => {
      console.log('============================')
      console.log('join_private_room: ', { User1Id, User2Id })
      console.log('============================')
      const options = {
        where: {
          [Op.or]: [
            { User1Id, User2Id },
            { User1Id: User2Id, User2Id: User1Id }
          ]
        }
      }
      const room = await Room.findOne(options)
      let roomId
      if (room) {
        roomId = room.id
      } else {
        roomId = await Room.create({ User1Id, User2Id })
        roomId = roomId.toJSON().id
      }
      // 找到User2 的socketId
      // check isOnline or not
      const isUser2Oneline = socketController.isUser2Oneline(User2Id)
      if (isUser2Oneline) {
        //join User1 into room
        socket.join(roomId)
        //join User2 into room
        user2SocketId = isUser2Oneline
        sockets[user2SocketId].join(roomId)
      }
      //return roomId to client
      callback({ roomId })
    })
    //listen privacy msg and send
    socket.on('post_private_msg', async ({ UserId, RoomId, content }) => {
      console.log('============================')
      console.log('post_private_msg: ', { UserId, RoomId, content })
      console.log('============================')
      if (content.length === 0 || !content) {
        return
      }
      const user = socketUsers[socket.id]
      const message = await Message.create({ UserId, RoomId, content })
      let createdAt = message.createdAt
      const avatar = user.avatar
      socket
        .to(RoomId)
        .emit('get_private_msg', { UserId, RoomId, content, avatar, createdAt })
    })
    /* get private history */
    socket.on('get_private_history', async ({ offset, limit, RoomId }, cb) => {
      const options = {
        offset,
        limit,
        order: [['createdAt', 'desc']],
        include: [
          {
            model: User,
            attributes: ['avatar'],
            as: 'User'
          }
        ],
        where: {
          RoomId
        }
      }
      let messages = await Message.findAll(options)
      messages.forEach((message) => {
        message.dataValues.avatar = message.dataValues.User.avatar
        delete message.dataValues.User
      })
      cb(messages)
    })
  })
}
