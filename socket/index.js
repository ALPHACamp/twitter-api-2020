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

 io.use((socket, next) => {
    const { handshake } = socket
    console.log('========== SOCKET AUTH ==========')
    console.log('socket.handshake', socket.handshake)
    if (!handshake.auth || !handshake.auth.token) {
      throw new Error('尚未授權，禁止存取!')
    }

    // if token is found inside socket data
    // then use jwt module to decode it and 
    // search for corresponding user from database
    jwt.verify(handshake.auth.token, process.env.JWT_SECRET,
      async (err, jwtPayload) => {
        try {
          if (err) throw new Error('尚未授權，禁止存取!')

          const user = await User.findByPk(jwtPayload.id, {
            raw: true,
            attributes: { exclude: ['password'] },
          })
          if (!user) throw new Error('尚未授權，禁止存取!')

          socket.user = user
          return next()

        } catch (err) { console.error(err) }
      })
  })
  
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
