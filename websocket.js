const socketIO = require('socket.io')

function initWebSocket (server) {
  const io = socketIO(server)

  io.on('connection', (socket) => {
    console.log('使用者連線')

    socket.on('chat message', (msg) => {
      console.log('收到訊息:', msg)
      socket.broadcast.emit('chat message', msg) // use broadcast.emit to send to all socket
      socket.emit('chat message', msg) // user .emit to sent to sender
    })

    socket.on('disconnect', () => {
      console.log('使用者斷開連線')
    })
  })
}

module.exports = { initWebSocket }
