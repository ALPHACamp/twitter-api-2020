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

  io.on('connection', socket => {
    let joinUser = false

    socket.on('chat message', msg => {
      io.emit('chat message', msg)
      socket.broadcast.emit('chat message', {
        userId: socket.userId,
        username: socket.username,
        msg
      })
    })

    // when the client emits 'add user', this listens and executes
    socket.on('join', (username) => {
      if (joinUser) return


      socket.username = username
      ++numUsers
      joinUser = true
      socket.emit('login', {
        numUsers: numUsers
      })

      // socket.broadcast.emit('user joined', {
      //   username: socket.username
      // })
    })

    // when the client emits 'typing', we broadcast it to others
    // socket.on('typing', () => {
    //   socket.broadcast.emit('typing', {
    //     username: socket.username
    //   })
    // })

    // when the client emits 'stop typing', we broadcast it to others
    // socket.on('stop typing', () => {
    //   socket.broadcast.emit('stop typing', {
    //     username: socket.username
    //   })
    // })

    // when the user disconnects.. perform this
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
