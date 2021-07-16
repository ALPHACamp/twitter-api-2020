module.exports = (server) => {
  const io = require('socket.io')(server)

  io.on('connection', socket => {
    console.log('A user connecting')

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



}