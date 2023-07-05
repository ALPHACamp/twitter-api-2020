const usersInPublic = require('./userOnline')
const { userExist, emitError, findUserInPublicWithAccount } = require('../helper')

module.exports = async (io, socket, account) => {
  try {
    // 檢查 使用者是否存在上線名單中
    const userOnList = findUserInPublicWithAccount(account)

    if (userOnList) {
      // 使用者 reconnect
      console.log('使用者已經恢復連線 取消timeout')
      clearTimeout(userOnList.timeout)
      delete userOnList.timeout
    } else {
      // 使用者上線
      console.log('使用者上線')
      const user = await userExist(account)
      user.socketId = socket.id

      // 給全部使用者 更新的上線名單
      usersInPublic.push(user)
      io.emit('server-update', usersInPublic)
      // broadcast 上線訊息
      socket.broadcast.emit('server-join', `${user.name} 上線`)
    }
  } catch (err) {
    emitError(socket, err)
  }
}
