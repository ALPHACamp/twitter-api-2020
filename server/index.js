const messageService = require('../services/messageService')

module.exports = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', socket => {
    console.log('A user connecting')
    console.log(socket.handshake.headers.host)
    console.log(socket.handshake.url)
    console.log(io.of("/").sockets.size)

    // 可以在伺服器端顯示通道過來的所有事件，以及相關的參數
    socket.onAny((event, ...args) => {
      console.log(event, args)
    })
    messageService.getMessages(socket)

    require('./modules/listUser')(io, socket)
    require('./modules/enterNotice')(socket)

    socket.on('chat message', msg => {
      messageService.saveMessage(msg)
      const timeStamp = new Date()
      const message = {
        id: socket.id,
        createdAt: timeStamp,
        message: msg
      }
      socket.emit('chat message', message)
    })
  })

  // io.engine.on('connection_error', (err, socket) => {
  //   console.log(err.req)     // the request object
  //   console.log(err.code)    // the error code, for example 1
  //   console.log(err.message)  // the error message, for example "Session ID unknown"
  //   console.log(err.context)  // some additional error context
  // })
}
