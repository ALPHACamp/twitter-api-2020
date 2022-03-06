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
  io.on('connection', socket => {
    console.log('===== User connected =====')
    // console.log('socket.userId', socket.userId)
    socket.on('chat message', msg => {
      io.emit('chat message', msg)
    })
  })
}


module.exports = {
  socket
}