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
      console.log(socket)
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
        time: Date.now(),
        user: socket.user
      }
      socket.broadcast.emit('welcome', data)
    })
  })
}

module.exports = socket
