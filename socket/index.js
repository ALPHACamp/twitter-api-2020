const socketio = require('socket.io')
const { authenticatedSocket } = require('../middleware/auth')


const socket = server => {
  const io = socketio(server, {
    cors: {
      origin: [
        'http://localhost:8080',
        'https://lgtits.github.io'
      ],
      methods: ["GET", "POST"],
      credentials: true
    },
    allowEI03: true
  })

  let numUsers = 0
  let connectedUser = []

  io.on('connection', socket => {
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

      const msg = '已經進入聊天室'
      ++numUsers
      joinUser = true
      connectedUser.push(userName)
      io.emit('user connected', msg)
    })
    
    socket.on('disconnect', () => {
      if (joinUser) {
        --numUsers
      }
    })
  })
}


module.exports = {
  socket
}
