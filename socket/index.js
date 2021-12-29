const publicChat = require('./modules/publicChat')
const privateChat = require('./modules/privateChat')

module.exports = server => {
  const io = require('socket.io')(server, {
    cors: {
      origin: ['http://localhost:8080', 'https://dollychen-cyc.github.io/twitter-chatroom-frontend/'],
      credentials: true
    },
    allowEIO3: true
  })

  // 連線瀏覽器即產生 socket id
  io.on('connection', socket => {
    console.log(`user connected, id: ${socket.id}`)
    console.log('connecting users: ', io.of('/').sockets.size)

    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    publicChat(io, socket)
    privateChat(io, socket)

    // 關閉瀏覽器後才算離開 socket
    socket.on('disconnect', () => {
      console.log(`user disconnected, id: ${socket.id}`)
    })
  })
}
