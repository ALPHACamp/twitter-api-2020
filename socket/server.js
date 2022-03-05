const PUBLIC_ROOM_ID = 1

module.exports = server => {
  const io = require('socket.io')(server)

  io.on('connection', socket => {
    console.log('---user connected---')
    console.log('目前連線數量: ', socket.server.engine.clientsCount)

    //顯示通道過來的所有事件，以及相關的參數
    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    
    socket.on('join', ({ roomId }) => {

      roomId = Number(roomId)
      socket.join(`${roomId}`)
      io.emit('test message', '後端 test 123，收到請回答')

      //如果是公開聊天室
      if (roomId === PUBLIC_ROOM_ID) { 
        io.to(`${PUBLIC_ROOM_ID}`).emit('message', { message: `${user.name}上線`, type: 'notice' })
      }
    })

    socket.on('chat message', message => {
      if (message.replace(/\s+/, "") === "") throw new Error("message can't be null")
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
