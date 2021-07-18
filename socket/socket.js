const sockets = []
const userSockets = {}
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
    return await User.findAll({
      where: {
        id: {
          [Op.or]: Object.keys(userSockets).map(x => +x)
        }
      },
      attributes: [id, name, account, avatar]
    })
  }

  io.use(wrap(authenticatedSocket)).on('connection', (socket) => {
    // console.log(socket.request.user)
    const currentUser = socket.request.user
    /* connect */
    sockets.push(socket)
    userSockets[currentUser.id] = socket.id
    console.log(`User is online: ${socket.id}`)
    socket.emit('message', `Your socket id is  ${socket.id}`)
    io.emit('online_users', { users: onlineUsers() })
    socket.on('sendMessage', (data) => console.log(data))

    /* disconnect */
    socket.on('disconnect', () => {
      delete userSockets[currentUser.id]
      sockets.splice(sockets.indexOf(socket), 1)
      console.log(`User is offline: ${socket.id}`)
      io.emit('online_users', { users: onlineUsers() })
    })

    /* join public room */
    socket.on('join_public_room', async ({ userId }) => {
      const user = await User.findByPk(userId)
      io.emit('new_join', {
        name: user.name
      })
    })
    /* leave public room */
    socket.on('leave_public_room', async ({ userId }) => {
      const user = await User.findByPk(userId)
      io.emit('user_leave', {
        name: user.name
      })
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
      const user = await User.findByPk(userId)
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
      //return roomId to client
      console.log('roomId', roomId)
      // check isOnline or not
      if (userSockets[User2Id]) {
        //join User1 into room
        socket.join(roomId)
        //join User2 into room
        user2Socket = sockets.find(
          (socket) => socket.id === userSockets[User2Id]
        )
        user2Socket.join(roomId)
      }
      callback({ roomId }, socket.id)
    })
    //listen privacy msg and send
    socket.on('post_private_msg', async ({ UserId, RoomId, content }) => {
      // console.log('=========')
      // console.log({ UserId, RoomId, content })
      // console.log('=========')

      const user = await User.findByPk(+UserId)
      const message = await Message.create({ UserId, RoomId, content })
      // console.log(user.toJSON())
      // console.log(message.toJSON())
      // const user = array[0].toJSON()
      //  = array[1].toJSON()
      let createdAt = message.createdAt
      const avatar = user.avatar
      socket
        .to(RoomId)
        .emit('get_private_msg', { UserId, RoomId, content, avatar, createdAt })
    })
  })
}
