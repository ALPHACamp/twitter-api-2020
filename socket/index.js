const socketio = require('socket.io')
const { authenticatedSocket } = require('../middleware/auth')


const socket = server => {
  const io = socketio(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"],
    },
    allowEI03: true
  })

  let numUsers = 0
  let connectedUser = []

  io.on('connection', socket => {
    let joinUser = false
    let isHere = true
    console.log('===== SOCKET =====')
    console.log(socket)
    // const loginUser = {
    //   isHere,
    //   avatar: socket.user.avatar,
    //   name: socket.user.name,
    //   account: socket.user.account
    // }
    // connectedUser.push(loginUser)
    updateUser()

    socket.on('chat message', msg => {
      const userData = {
        isHere,
        userId: msg.userId,
        content: msg.msg,
        avatar: socket.user.avatar,
        name: socket.user.name,
        account: socket.user.account,
        createdTime: new Date(),
      }

      io.emit('chat message', userData)
    })

    // socket.on('join room', () => {
    //   if (joinUser) return

    //   const msg = '進入聊天室'
    //   console.log(msg)
    //   ++numUsers
    //   joinUser = true
    //   connectedUser.push(userName)
    //   updateUser()
    //   socket.emit('user join', msg)
    // })
    
    socket.on('disconnect', () => {
      // if (joinUser) {
      //   const msg = '離開聊天室'
      //   console.log(msg)
      //   --numUsers
      //   connectedUser.splice(connectedUser.indexOf(userName), 1)
      //   socket.emit('user leave', msg)
      //   updateUser()
      // }
    })

    function updateUser() {
      io.emit('connectedUser', connectedUser)
    }
  })
}

module.exports = {
  socket
}
