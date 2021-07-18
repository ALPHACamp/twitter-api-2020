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
  const io = socketio(server)
  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next)

  async function onlineUsers() {
    return publicRoomUsers.map(id => {
      return {
        id,
        name: socketUsers[id].name,
        account: socketUsers[id].account,
        avatar: socketUsers[id].avatar
      }
    })
  }

  io.use(wrap(authenticatedSocket)).on('connection', (socket) => {
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
      publicRoomUsers.push(userId)
      const user = socketUsers[userId]
      io.emit('new_join', {
        name: user.name
      })
      io.emit('online_users', {
        users: onlineUsers()
      })
    })
    /* leave public room */
    socket.on('leave_public_room', async ({ userId }) => {
      publicRoomUser.splice(publicRoomUser.indexOf(userId), 1)
      const user = socketUsers[userId]
      io.emit('user_leave', {
        name: user.name
      })
      io.emit('online_users', { users: onlineUsers() })
    })

    /* get public history */
    socket.on('get_public_history', async ({ offset, limit }, cb) => {
      const message = await Message.findAll({
        offset,
        limit,
        order: [['createdAt', 'desc']],
        include: [
          {
            model: User,
            attributes: ['avatar'],
            as: 'User'
          }
        ]
      })
      cb(message)
    })

    /* public message */
    socket.on('post_public_msg', async ({ msg, userId }) => {
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
          (socket) => socket.id === userSockets[User2Id]
          )
          user2Socket.join(roomId)
        }
      //return roomId to client
      callback({ roomId }, socket.id)
    })
    //listen privacy msg and send
    socket.on('post_private_msg', async ({ UserId, RoomId, content }) => {
      const user = socketUsers[userId]
      const message = await Message.create({ UserId, RoomId, content })
      let createdAt = message.createdAt
      const avatar = user.avatar
      socket
        .to(RoomId)
        .emit('get_private_msg', { UserId, RoomId, content, avatar, createdAt })
    })
  })
}
