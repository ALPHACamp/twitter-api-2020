const { Server } = require('socket.io')

const { postChat, joinPrivateChat } = require('../services/chatService')

const { socketAuth } = require('../middlewares/auth')

let io
const users = []

function addUsers(target) {
  const exist = users.some(e => e.id === target.id)
  if (exist) { return console.log('exist!') }
  users.push(target)
}

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

    io.use(socketAuth).on('connection', (socket) => {
      const { clientsCount } = io.engine
      console.log('A user connected ', clientsCount)

      socket.on('joinPublic', () => {
        console.log(`User ${socket.user.name}Join public!!!`)
        addUsers(socket.user)
        console.log(users)
        socket.emit('announce', {
          users, message: `${socket.user.name} joined.`
        })
      })

      socket.on('leavePublic', () => {
        console.log('leaving!!!')
        users.splice(users.indexOf(socket.user))
        console.log(users)
        socket.emit('announce', {
          users, message: `${socket.user.name} left.`
        })
      })

      socket.on('chatMessage', async (message) => {
        console.log(message)
        if (!message || !message.text || !message.text.trim().length) {
          console.log(message.text)
          return
        }
        await this.chatMessage(socket, message)
      })

      socket.on('createRoom', async (targetUserId) => {
        if (!targetUserId) return
        const room = await joinPrivateChat(socket.user.id, targetUserId)
        socket.join(room.name)
        console.log(`User ${socket.user.name} joined room ${room.name} (createRoom)`)
        socket.emit('newRoom', room.id)
        console.log(`roomId = ${room.id}`)
        console.log(socket.rooms)
      })

      socket.on('joinRoom', (roomName) => {
        if (!roomName) return
        socket.join(roomName)
        console.log(`User ${socket.user.name} joined room ${roomName}`)
        console.log(socket.rooms)
      })

      socket.on('disconnect', (reason) => {
        if (users.find(user => user === socket.user)) {
          users.splice(users.indexOf(socket.user))
        }
        socket.emit('announce', {
          users, message: `${socket.user.name} left.`
        })
        socket.disconnect(true)
        console.log(`${socket.id} is leaving.`, clientsCount)
      })
    })
  },
  async chatMessage(socket, message) {
    if (+message.RoomId === -1) return console.log('RoomId: -1')
    await postChat({
      UserId: message.User.id,
      text: message.text,
      createdAt: message.createdAt,
      updatedAt: message.createdAt,
      RoomId: message.RoomId
    })
    if (message.RoomName) {
      return io.to(message.RoomName).emit('chatMessage', message)
    }
    return io.emit('chatMessage', message)
  }
}