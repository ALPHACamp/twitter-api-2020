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

  io.use(authenticatedSocket).on('connection', socket => {
    let isHere = true
    const updateUserList = async () => {
      const sockets = await io.fetchSockets()
      let set = new Set()
      const arr = sockets.map(data => ({
        isHere,
        userId: data.user.id,
        avatar: data.user.avatar,
        name: data.user.name,
        account: data.user.account,
        type: 'login'
      }))
      const usersList = arr.filter(i => !set.has(i.userId) ? set.add(i.userId) : false)
      io.emit('userList', usersList)
    }
    updateUserList()
    
    socket.on('chat message', msg => {
      const userData = {
        isHere,
        userId: msg.userId,
        content: msg.msg,
        avatar: socket.user.avatar,
        name: socket.user.name,
        account: socket.user.account,
        createdTime: new Date(),
        type: 'chat'
      }

      updateUserList()
      io.emit('chat message', userData)
    })
    
    socket.on('disconnect', reason => {
      console.log(reason)
      const msg = {
        userId: socket.user.userId,
        name: socket.user.name,
        type: 'logout'
      }

      io.emit('disconnect', msg)
    })
  })
}

module.exports = {
  socket
}
