const { Server } = require('socket.io')

const { postChat } = require('../services/chatService')

const { socketAuth } = require('../middlewares/auth')

let io
const users = []

module.exports = {
  init(server) {
    io = new Server(server, {
      cors: {
        // process.env.CORS_WHITE_LIST.split(','),
        origin: ['http://localhost:8080'],
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
      users.push(socket.user)
      console.log(users)

      // socket.on('joinPublic', () => {
      socket.emit('announce', {
        users, message: `${socket.user.name} joined.`
      })
      // })

      socket.on('chatMessage', async (message) => {
        console.log(message)
        if (!message.text.trim().length) {
          console.log(message.text)
          throw new Error('Empty message.')
        }
        await postChat({
          UserId: message.User.id,
          text: message.text,
          createdAt: message.createdAt,
          updatedAt: message.createdAt
        })
        io.emit('chatMessage', message)
      })

      socket.on('privateMessage', async (message) => {
        console.log('private', message)
        await postChat({
          UserId: message.User.id,
          text: message.text,
          createdAt: message.createdAt,
          updatedAt: message.createdAt,
          RoomId: message.id
        })
        socket.to(roomId).emit('privateMessage', message)
      })

      socket.on('eventA', (ctx) => {
        console.log('\n', ctx)
        socket.emit('eventA', ctx)
      })

      socket.on('disconnect', (reason) => {
        users.splice(users.indexOf(socket.user))
        console.log(users)

        socket.emit('announce', {
          users, message: `${socket.user.name} left.`
        })
        console.log(`${socket.id} is leaving.`, clientsCount)
      })
    })
  }
}