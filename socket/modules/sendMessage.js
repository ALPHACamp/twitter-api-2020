const { userExist, hasMessage, emitError } = require('../helper')

// 公開訊息與私人訊息之後會使用 room 參數判斷
module.exports = async (io, socket, userAccount, message, room = null) => {
  try {
    // 檢查 使用者存在
    const user = await userExist(userAccount)

    // 檢查有沒有訊息 (同時用trim)
    const trimmedMessage = hasMessage(message)

    // 有room的是私訊，沒有的是公開
    if (!room) {
      socket.broadcast.emit('server-message', {
        user,
        message: trimmedMessage,
        timestamp: new Date()
      })
    }
  } catch (err) {
    emitError(socket, err)
  }
}
