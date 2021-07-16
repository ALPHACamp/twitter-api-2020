const { Server } = require('socket.io')

const { postChat } = require('../services/chatService')

const { socketAuth } = require('../middlewares/auth')

let io
const users = new WeakSet()

module.exports = {
  init(server) {
    io = new Server(server, {
      cors: {
        origin: process.env.CORS_WHITE_LIST.split(','),
        methods: ['GET', 'POST'],
        transports: ['websocket', 'polling'],
        credentials: true
      },
      allowEIO3: true
    })
  },
  connect() {
    if (!io) throw new Error('No socket io server instance')

    io.use(socketAuth)

    io.on('connection', (socket) => {
      const { clientsCount } = io.engine
      console.log('A user connected ', clientsCount)
      users.add(socket.user)

      io.emit('connection', clientsCount)
      const announce = `User ${socket.id} joined the public room.`
      socket.emit('announce', {
        users, message: `${socket.user.name} joined.`
      })
      socket.on('chatMessage', async (message) => {
        await postChat({
          UserId: message.User.id,
          text: message.text,
          createdAt: message.createdAt,
          updatedAt: message.time
        })
        io.emit('chatMessage', message)
      })

      socket.on('disconnect', (reason) => {
        users.delete(socket.user)
        socket.emit('announce', {
          users, message: `${socket.user.name} left.`
        })
        console.log(`${socket.id} is leaving.`, clientsCount)
      })
    })
  }
}