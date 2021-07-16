module.exports = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: ['http://localhost:8080', 'https://marcolin1.github.io/'],
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', socket => {
    console.log('A user connecting')
    console.log(socket.handshake.headers.host)
    console.log(socket.handshake.url)

    // 可以在伺服器端顯示通道過來的所有事件，以及相關的參數
    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    // 引用module的功能檔案在這之下
    // 1. 顯示所有使用者
    require('./modules/listUser')
    // 2. 聊天室內登入通知
    require('./modules/enterNotice')

    socket.on('chat message', msg => {
      socket.emit('chat message', msg)
    })

  })

  io.engine.on('connection_error', (err) => {
    console.log(err.req)     // the request object
    console.log(err.code)    // the error code, for example 1
    console.log(err.message)  // the error message, for example "Session ID unknown"
    console.log(err.context)  // some additional error context
  })



}