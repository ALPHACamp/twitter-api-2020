module.exports = server => {
  const io = require('socket.io')(server)

  io.on('connection', socket => {
    console.log('---user connected---')

    socket.on('chat message', message => {
      console.log('message: ' + message)

      //發送 allMessage事件的訊息給所有連線用戶
      io.emit('chat message', message)
    })

    socket.on('disconnect', reason => {
      console.log(reason)
      console.log(socket.rooms)
      console.log('Bye~') // 顯示 bye~
    })
  })
}
