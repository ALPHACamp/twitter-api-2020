const { User, Chat, Room } = require('../models/index')
const onlineUsers = [] // online users in public chat room
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

    // users inform server that them are offline
    socket.on('disconnect', () => {
      console.log('客戶端停止連接')
      const userId = socket.user.id
      if (!userId) { return }
      const index = onlineUsers.findIndex(user => user.id === userId)
      if (index < 0) { return }
      const data = {
        user: onlineUsers.splice(index, 1)[0],
        onlineUsers
      }
      socket.broadcast.emit('public-room-offline', data)
    })

    socket.emit('welcome', '歡迎連接 socket')

    // users send messages to 'hello' chat room
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

    // users send messages to 'public' chat room
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

    // users inform server that them are online
    socket.on('public-room-online', async (userId) => {
      try {
        if (!userId) {
          socket.emit('error', 'No id.')
          return
        }
        let user = await User.findByPk(userId, { attributes: ['id', 'name', 'avatar'] })
        if (!user) {
          socket.emit('error', 'User not found.')
          return
        }
        user = user.toJSON()
        socket.user = user
        user.socketId = socket.id
        onlineUsers.push(user)
        const data = {
          user,
          onlineUsers
        }

        socket.emit('public-room-online', { onlineUsers })
        socket.broadcast.emit('public-room-online', data)
      } catch (error) {
        console.log(error)
        socket.emit('error', 'Something wrong, please try again later.')
      }
    })

    // users inform server that them want to be setted as offline
    socket.on('public-room-offline', (userId) => {
      console.log('客戶端停止連接')
      if (!userId) { return }
      const index = onlineUsers.findIndex(user => user.id === userId)
      if (index < 0) { return }
      const data = {
        user: onlineUsers.splice(index, 1)[0],
        onlineUsers
      }
      socket.broadcast.emit('public-room-offline', data)
    })
  })
}

module.exports = socket
