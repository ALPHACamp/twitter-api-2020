const sockets = []
const userSockets = {}
const socketio = require('socket.io')
const db = require('../models')
const Message = db.Message
const User = db.User
const { Op } = require("sequelize")
const { authenticatedSocket } = require('../middleware/auth')

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
    console.log(socket.request.user)
    /* connect */
    sockets.push(socket)
    userSockets[socket.request.user.id] = socket.id
    console.log(`User is online: ${socket.id}`)
    socket.emit('message', `Your socket id is  ${socket.id}`)

    io.emit('online_users', { users: onlineUsers() })
    socket.on('sendMessage', (data) => console.log(data))
    /* disconnect */
    socket.on('disconnect', () => {
      delete userSockets[socket.request.user.id]
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

    /* get public history */
    socket.on('get_public_history', async (offset, limit, cb) => {
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
  })
}
