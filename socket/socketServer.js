const db = require('../models/index')
const { User } = db

module.exports = function (io) {
  io.use(async (socket, next) => {
    // authentication
    const userId = socket.handshake.userId // frontend - socket.userId = 1; socket.connect();
    const user = await User.findbyPk(userId, {
      attributes: ['id', 'name', 'account', 'avatar']
    })
    if (!user) return next(new Error('No user found'))

    socket.user = user.toJSON()
    next()
  })

  io.on('connection', (socket) => {
    // fetch existing users
    const users = []
    // io.of('/').sockets is a Map with socketId as key => socket as value
    for (const [id, socket] of io.of('/').sockets) {
      users.push({
        socketID: id,
        user: socket.user // {id: , name: , account: , avatar: ,}
      })
    }
    socket.emit('users', users) // emit user list to frontend - [{socketID: id, user: socket.user}, {}, ...]

    // broadcast username to frontend when someone is connected.
    socket.broadcast.emit('userConnected', {
      username: socket.user.name
    })

    // listen to publicMessage, then broadcast message to all users(sockets)
    socket.on('publicMessage', (msg) => {
      socket.broadcast.emit('publicMessage', msg) // msg is an object = {content: , time: }
    })

    // notify users upon disconnection
    socket.on('disconnect', () => {
      socket.broadcast.emit('user disconnected', {
        username: socket.user.name
      })
    })
  })
}
