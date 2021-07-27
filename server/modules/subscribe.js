const notificationService = require('../../services/notificationService')

module.exports = (io, socket) => {
  // 訂閱
  socket.on('subscribe', async msg => {
    try {
      const channelName = `Channel${msg.recipientId}`
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
      const channelName = `Channel${msg.recipientId}`
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
      const { id, content, labelName } = msg
      const channelName = `Channel${id}`

      notificationService.addNotification(id, content, labelName)

      io.to(channelName).emit('subscribeNotify', msg)
    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })

  // 互動通知
  socket.on('reactionNotify', async msg => {
    try {
      const { id, receiverId, content, labelName } = msg
      const channelName = `user${receiverId}`

      notificationService.addNotification(id, content, labelName, receiverId)

      io.to(channelName).emit('reactionNotify', msg)
    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })

  // 進入通知頁面
  socket.on('enterNotify', async msg => {
    try {
      const { id } = msg

      notificationService.clearUnread(id)
    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })
}