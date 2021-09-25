const PUBLIC_ROOM_ID = 1
const socketService = require('../services/socketService')
const { authenticatedSocket } = require('../middleware/auth')
const { generateMessage } = require('./message')

module.exports = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    pingTimeout: 30000,
    rejectUnauthorized: false,
    maxHttpBufferSize: 100000000,
  })

  io.use(authenticatedSocket).on('connection', async socket => {
    console.log('== connected! ===')
    console.log(socket.userId)

    io.emit('debug notice', `安安收到token${socket.handshake.auth.token}`)
    
    const userId = socket.userId

    const user = await socketService.getUser(userId)
    console.log(user)
    let activeUsers = []
    socket.on('join', async ({ roomId }) => {

      roomId = Number(roomId)
      socket.join(`${roomId}`)
      console.log('socket.rooms', socket.rooms)
      io.emit('debug notice', '安安這是後端, 有收到上線訊息')
      if (roomId === PUBLIC_ROOM_ID) {
        activeUsers.push(user)
        const set = new Set()
        activeUsers = activeUsers.filter(i => !set.has(i.id)?set.add(i.id):false)
        
        io.to(`${PUBLIC_ROOM_ID}`).emit('active users', {
          activeUsers,
          userCount: activeUsers.length,
        })

        // notify everyone except the user
        io.to(`${PUBLIC_ROOM_ID}`).emit('message', generateMessage(`${user.name}已上線`, user.id, user.avatar, notice))
      }
    })

    socket.on('leave', async ({ roomId }) => {
      console.log('== receive leave message===')
      console.log(userId)
      io.emit('debug notice', `安安這是後端, 有收到來自UserId:${userId} 離開 RoomId${roomId}的訊息`)
      if (roomId) {
        // socket.leave(`${roomId}`)
        if (roomId === PUBLIC.PUBLIC_ROOM_ID) {
          activeUsers = activeUsers.filter(i => {
            return i.id !== userId
          })
          console.log(activeUsers)
          io.to(`${PUBLIC_ROOM_ID}`).emit('message', `${user.name}下線`)
        }
      }
    })

    socket.on('public chat', async (message) => {
      console.log('=== receive public chat message ===')
      await socketService.storeMessage(message)
      io.to(`${PUBLIC_ROOM_ID}`).emit('debug notice', '安安這是後端, 有收到公共聊天室訊息')
      io.to(`${PUBLIC_ROOM_ID}`).emit('public chat', generateMessage(message, userId, user.avatar))
    })

    socket.on('private chat', async (msg) => {
      console.log('=== receive public chat message ===')
    })


  })
}

