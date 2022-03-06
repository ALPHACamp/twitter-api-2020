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
    socket.on('chat message', msg => {
      io.emit('chat message', msg)
    })

    socket.on('join', () => {
      console.log('===== user join =====')
      socket.join('chatroom')
      socket.broadcast.to('chatroom').emit('===== User connect =====')
    })

    socket.on('leave', () => {
      console.log('===== user leave =====')
      socket.leave('chatroom')
      socket.broadcast.to('chatroom').emit('===== User disconnect =====')
    })
  })
}


module.exports = {
  socket
}