const usersInPublic = require('./userOnline')
const { findUserInPublic, findUserIndexInPublic, emitError } = require('../helper')
const leaveRoomEvent = require('./leaveRoom')

module.exports = async socket => {
  try {
    // 檢查 使用者在不在上線名單上
    const userOnline = findUserInPublic(socket.id, 'socketId', false)
    if (!userOnline) {
      // 開發使用提示
      throw new Error('leave Error: 上線名單上找不到使用者！')
    }

    // 目前在房間內的話就離開房間
    if (userOnline.currentRoom) {
      console.log('trigger leave room')
      await leaveRoomEvent(socket)
    }

    // 清除可能遺留的計時器
    if (userOnline.timeout) {
      clearTimeout(userOnline.timeout)
      delete userOnline.timeout
    }

    // broadcast 下線訊息
    socket.broadcast.emit('server-leave', `${userOnline.name} 下線`)
    console.log(`使用者 ${userOnline.name} 下線`)

    // 從上線名單移除使用者
    usersInPublic.splice(findUserIndexInPublic(userOnline.id, 'id'), 1)

    // 給全部使用者 更新的上線名單
    socket.broadcast.emit('server-update', usersInPublic)

    return
  } catch (err) {
    // 因為使用者已經不在線上，有沒有要處理在考慮
    // 傳給 postman
    emitError(socket, err)
  }
}
