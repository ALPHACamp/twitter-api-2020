const messageService = require('../../services/messageService')

module.exports = (io, socket, users) => {
  // 公開聊天
  socket.on('chatMessage', async msg => {
    try {
      const message = await messageService.saveMessage(msg)

      return io.emit('chatMessage', message)

    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })

  // 離開公開聊天室事件
  socket.on('leavePublic', async msg => {
    const matchingSockets = await io.in(`user${socket.data.id}`).allSockets()
    const isDisconnected = matchingSockets.size === 0

    if (isDisconnected) {
      users.delete(socket.data.id)

      socket.broadcast.emit('userDisconnected', {
        name: socket.data.name,
        isOnline: 0
      })

      io.emit('users', [...users.values()])
    }
  })
}