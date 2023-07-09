const { userExistInDB, hasMessage, findUserInPublic, emitError } = require('../helper')
const { Chat } = require('../../models')
// 公開訊息與私人訊息之後會使用 room 參數判斷
module.exports = async (io, socket, message, roomId, timestamp) => {
  try {
    // default
    const room = roomId ?? '1'
    const time = timestamp ?? new Date()

    // 檢查 使用者存在
    const currentUser = findUserInPublic(socket.id, 'socketId')
    if (!currentUser) throw new Error('You need to client-join first')
    const userId = currentUser.id
    const user = await userExistInDB(userId, 'id')

    // 檢查有沒有訊息 (同時用trim)
    const trimmedMessage = hasMessage(message)

    // 回傳資訊
    const msgPackage = {
      user,
      message: trimmedMessage,
      timestamp: time,
      room
    }
    // 傳遞
    if (room === '1') {
      // 公開訊息
      socket.broadcast.emit('server-message', msgPackage)
    } else {
      // 一對一訊息
      socket.to(room).emit('server-message', msgPackage)
    }
    // 儲存訊息至DB
    await Chat.create({
      message: trimmedMessage,
      userId: user.id,
      roomId: room,
      timestamp: time
    })
  } catch (err) {
    emitError(socket, err)
  }
}
