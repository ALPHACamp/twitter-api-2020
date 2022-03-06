const socketio = require('socket.io')
const { authenticatedSocket } = require('../middleware/auth')


const socket = server => {
  const io = socketio(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    },
    allowEI03: true
  })

  let numUsers = 0
  let connectedUser = []

  io.use(authenticatedSocket).on('connection', socket => {
    let joinUser = false

    socket.on('chat message', msg => {
      const userData = {
        socketId: socket.user.id,
        socketAvatar: socket.user.avatar,
        createdTime: new Date()
      }

      io.emit('chat message', { msg, ...userData })
    })

    socket.on('join', () => {
      if (joinUser) return

      const msg = '進入聊天室'
      ++numUsers
      joinUser = true
      connectedUser.push(userName)
      updateUserName()
      io.emit('user join', msg)
    })
    
    socket.on('disconnect', () => {
      if (joinUser) {
        const msg = '離開聊天室'
        --numUsers
        connectedUser.splice(connectedUser.indexOf(userName), 1)
        io.emit('user leave', msg)
        updateUserName()
      }
    })

    function updateUserName() {
      io.emit('loadUser', connectedUser)
    }
  })
}

module.exports = {
  socket
}
