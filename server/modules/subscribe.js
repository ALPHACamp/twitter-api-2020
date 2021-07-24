module.exports = (io, socket) => {
  // 訂閱
  socket.on('subscribe', async msg => {
    try {
      const channelName = `channel${msg.recipientId}`
      socket.join(channelName)

    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })

  // 取消訂閱
  socket.on('subscribe', async msg => {
    try {
      const channelName = `channel${msg.recipientId}`
      socket.leave(channelName)

    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })

  // 訂閱通知
  socket.on('subscribeNotify', async msg => {
    try {
      const channelName = `channel${msg.id}`

      io.to(channelName).emit('subscribeNotify', msg)
    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })
}