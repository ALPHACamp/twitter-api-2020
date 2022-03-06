const socketio = require('socket.io')
const { authenticatedSocket } = require('../middleware/auth')
const { User } = require('../models')

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

    // when the client emits 'add user', this listens and executes
    socket.on('join', () => {
      if (joinUser) return

  
      ++numUsers
      joinUser = true
      connectedUser.push(userName)
      io.emit('chat message', msg)
      socket.broadcast.emit('login', {
        numUsers
      })

      // socket.broadcast.emit('user joined', {
      //   username: socket.username
      // })
    })
    socket.on('disconnect', () => {
      if (joinUser) {
        --numUsers

        // echo globally that this client has left
        socket.broadcast.emit('user left', {
          username: socket.username,
          numUsers: numUsers
        })
      }
    })
  })
}


module.exports = {
  socket
}
