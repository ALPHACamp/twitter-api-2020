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

  // let numUsers = 0

  io.use(authenticatedSocket).on('connection', async socket => {
    const userList = () => {
      const sockets = io.fetchSockets()
    // let connectedUser = []
      let isHere = true
      const loginUser = sockets.map(data => ({
        isHere,
        userId: data.id,
        avatar: data.avatar,
        name: data.name,
        account: data.account
      }))
      console.log(loginUser)
      return loginUser
    }
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
      updateUser()
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
      // socket.leave()
      if (isHere) {
        const msg = `${socket.user.name} 已離開囉`
        // --numUsers
        socket.emit('user disconnect', msg)
        updateUser()
      }
    })

    function updateUser() {
      io.emit('connectedUser', userList)
    }
    // function updateNumUsers () {
    //   io.emit('numUsers', numUsers)
    // }
  })
}

module.exports = {
  socket
}
