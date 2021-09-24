const socketio = require('socket.io')
const { getCurrentUser } = require('../services/userService')


module.exports = (server) => {
  const io = socketio(server)

  // const io = socketio(server, {
  //   cors: {
  //     origin: ['http://localhost:3000', 'https://pooppicker.github.io'],
  //     methods: ['GET', 'POST'],
  //     transports: ['websocket', 'polling'],
  //     credentials: true,
  //   },
  //   allowEIO3: true,
  // })


  io.on('connection', (socket) => {
    console.log('========user connected=========')
    
    // 建立一個 "sendMessage" 的監聽
    socket.on('sendMessage', function (message) {
      console.log(message)
      
      // 當收到事件的時候，也發送一個 "allMessage" 事件給所有的連線用戶
      socket.broadcast.emit('allMessage', message)
    })
  })

  // io.on('connection', async (socket) => {
    
  //   console.log(socket.userId)
  //   const userId = socket.data.userId

  //   const user = socketService.getCurrentUser(userId)
  //   socket.on('join', async ({ username, roomId }) => {
  //     // console.log('===== receive join =====')
  //     // console.log('username', username)
  //     // console.log('roomId', roomId)
  //     // console.log('PUBLIC_ROOM_ID', PUBLIC_ROOM_ID)
  //     const activeUsers = new Set()
  //     roomId = Number(roomId)
  //     socket.join(`${roomId}`)
  //     console.log('socket.rooms', socket.rooms)

  //     await updateTime(userId, roomId)

  //     if (roomId === PUBLIC_ROOM_ID) {
  //       activeUsers.add(user)

  //       io.to(`${roomId}`).emit('users count', {
  //         activeUsers: [...activeUsers],
  //         userCount: activeUsers.length,
  //       })

  //       // notify everyone except the user
  //       socket.broadcast.to(`${roomId}`).emit('message', generateMessage(`${username} 上線`))
  //     }
  //   })

  //   socket.on('public chat', async (msg) => {

  //   })

  //   socket.on('private chat', async (msg) => {
      
  //   })


  // })
}

