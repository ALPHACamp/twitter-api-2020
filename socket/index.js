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

  io.use(authenticatedSocket).on('connection', async socket => {
    const sockets = await io.fetchSockets()
    let joinUser = false
    let isHere = true
    console.log("===== sockets =====")
    console.log(sockets)

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

    socket.on('join', () => {
      if (joinUser) return

      const msg = '進入聊天室'
      ++numUsers
      joinUser = true
      connectedUser.push(userName)
      updateUserName()
      socket.emit('user join', msg)
    })
    
    socket.on('disconnect', () => {
      if (joinUser) {
        const msg = '離開聊天室'
        --numUsers
        connectedUser.splice(connectedUser.indexOf(userName), 1)
        socket.emit('user leave', msg)
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
