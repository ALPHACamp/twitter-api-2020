const PUBLIC_ROOM_ID = 1
const activeUsers = new Set()

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


  io.on('connection', (socket) => {
    console.log('========user connected=========')
    
    // 建立一個 "sendMessage" 的監聽
    socket.on('sendMessage', function (message) {
      console.log(message)
      
      // 當收到事件的時候，也發送一個 "allMessage" 事件給所有的連線用戶
      io.emit('allMessage', '哈囉這是後端')
    })
  })

  io.on('connection', async (socket) => {
    
    console.log(socket.userId)
    const userId = socket.userId

    const user = socketService.getUser(userId)

    socket.on('join', async ({ roomId }) => {

      roomId = Number(roomId)
      socket.join(`${roomId}`)
      console.log('socket.rooms', socket.rooms)

      if (roomId === PUBLIC_ROOM_ID) {
        activeUsers.add(user)
        io.to(`${roomId}`).emit('active users', {
          activeUsers: [...activeUsers],
          userCount: activeUsers.length,
        })

        // notify everyone except the user
        socket.broadcast.to(`${PUBLIC_ROOM_ID}`).emit('message', `${user.name}上線`)
      }
    })

    socket.on('public chat', async (msg) => {
      
    })

    socket.on('private chat', async (msg) => {
      
    })


  })
}

