const sockets = [] // array of sockets
const socketUsers = {} // key(userId) to value(socketId, name, account, avatar)
const publicRoomUsers = [] // array of userIds
const socketio = require('socket.io')
const db = require('../models')
const Message = db.Message
const User = db.User
const Room = db.Room
const { authenticatedSocket } = require('../middleware/auth')
const { Op } = require('sequelize')
module.exports = (server) => {
  const io = socketio(server, {
    cors: {
      origin: ['http://localhost:8080', 'https://ryanhsun.github.io'],
      credentials: true
    },
    allowEIO3: true
  })

  function onlineUsers() {
    return publicRoomUsers
      .filter((user, index) => publicRoomUsers.indexOf(user) === index)
      .map((id) => {
        return {
          id,
          name: socketUsers[id].name,
          account: socketUsers[id].account,
          avatar: socketUsers[id].avatar
        }
      })
  }

  io.use(authenticatedSocket).on('connection', (socket) => {
    console.log(socket.request.user)
    const currentUser = socket.request.user
    /* connect */
    sockets.push(socket)
    socketUsers[currentUser.id] = {
      socketId: currentUser.socketId,
      name: currentUser.name,
      account: currentUser.account,
      avatar: currentUser.avatar
    }
    console.log(`User is online: ${socket.id}`)
    socket.emit('message', `Your socket id is  ${socket.id}`)
    socket.on('sendMessage', (data) => console.log(data))

    /* disconnect */
    socket.on('disconnect', () => {
      delete socketUsers[currentUser.id]
      sockets.splice(sockets.indexOf(socket), 1)
      console.log(`User is offline: ${socket.id}`)
    })

    /* join public room */
    socket.on('join_public_room', async ({ userId }) => {
      console.log('============================')
      console.log('join_public_room', userId)
      console.log('加入拾得的socket ID',socket.id)

      publicRoomUsers.push(userId)
      const user = socketUsers[userId]
      io.emit('new_join', {
        name: user.name
      })
      const users = onlineUsers()
      console.log(users)
      io.emit('online_users', {
        users
      })
    })
    /* leave public room */
    socket.on('leave_public_room', async ({ userId }) => {
      console.log('============================')
      console.log('leave_public_room', userId)
      publicRoomUsers.splice(publicRoomUsers.indexOf(userId), 1)
      if (publicRoomUsers.some((id) => id === userId)) {
        return
      }
      const user = socketUsers[userId]
      io.emit('user_leave', {
        name: user.name
      })
      io.emit('online_users', { users: onlineUsers() })
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
    socket.on('post_public_msg', async ({ msg, userId }) => {
      console.log('============================')
      console.log('post_public_msg', { msg, userId })
      const message = await Message.create({
        RoomId: 1,
        UserId: userId,
        content: msg
      })
      const user = socketUsers[userId]
      socket.broadcast.emit('get_public_msg', {
        msg: message.content,
        createdAt: message.createdAt,
        avatar: user.avatar
      })
    })

    /* privacy message */
    socket.on('join_private_room', async ({ User1Id, User2Id }, callback) => {
      console.log('============================')
      console.log('join_private_room', { User1Id, User2Id })
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

      // check isOnline or not
      if (socketUsers[User2Id]) {
        //join User1 into room
        socket.join(roomId)
        //join User2 into room
        user2Socket = sockets.find(
          (socket) => socket.id === socketUsers[User2Id].socketId
        )
        user2Socket.join(roomId)
      }
      //return roomId to client
      callback({ roomId }, socket.id)
    })
    //listen privacy msg and send
    socket.on('post_private_msg', async ({ UserId, RoomId, content }) => {
      console.log('============================')
      console.log('post_private_msg', { UserId, RoomId, content })

      const user = socketUsers[UserId]
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
