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
  io.on('connection', socket => {
    console.log('客户端有连接')

    socket.on('connect', () => {
      console.log('客户端开始连接')
    })

    socket.on('disconnect', () => {
      console.log('客户端断开')
    })

    socket.emit('welcome', '欢迎连接socket')

    socket.on('hello', (arg) => {
      console.log('接收客户端发送数据:', arg)
    })
  })
}

module.exports = socket
