const { User, Chat, Room } = require('../models/index')
const sendErrorMsh = (error) => {
  console.log(error)
  return socket.emit('error', error.toString())
}

const socket = (httpServer) => {
  const options = {
    allowEIO3: true,
    cors: {
      origin: 'http://localhost:8080',
      methods: ['GET', 'POST'],
      credentials: true
    }
  }
  const io = require('socket.io')(httpServer, options)

  io.on('connection', async (socket) => {
    console.log('客戶端有連接')

    socket.on('connect', () => {
      console.log('客戶端開始連接')
    })

    socket.on('disconnect', () => {
      console.log('客戶端停止連接')
    })

    socket.emit('welcome', '歡迎連接 socket')

    socket.on('hello', (message) => {
      console.log('客戶端回傳訊息：', message)
      const data = {
        id: null,
        message,
        time: new Date(),
        user: socket.user
      }
      socket.broadcast.emit('welcome', data)
    })

    socket.on('public', async (message) => {
      try {
        const { userId, text } = message
        const user = await User.findByPk(userId, { raw: true, attributes: ['id', 'name', 'avatar'] })
        const roomId = (await Room.findOne({ raw: true, where: { name: 'public' } })).id
        const chat = (await Chat.create({
          message: text,
          UserId: userId,
          RoomId: roomId
        })).toJSON()
        const data = {
          id: chat.id,
          message: chat.message,
          time: chat.createdAt,
          userId: user.id,
          name: user.name,
          avatar: user.avatar
        }
        socket.broadcast.emit('public', data)
      } catch (error) {
        sendErrorMsh(error)
      }
    })
  })
}

module.exports = socket
