const usersInPublic = require('./userOnline')
const { userExistInDB, emitError, findUserInPublic } = require('../helper')

module.exports = async (io, socket, account) => {
  try {
    // 檢查 使用者是否存在上線名單中
    const userOnList = findUserInPublic(account, 'account')

    // 恢復連線
    if (userOnList?.timeout) {
      // 使用者 reconnect
      console.log('使用者已經恢復連線 取消timeout')
      clearTimeout(userOnList.timeout)
      // 更新socket.id
      userOnList.socketId = socket.id
      delete userOnList.timeout
    }

    // 新上線
    if (!userOnList) {
      // 使用者上線
      console.log('使用者上線')
      const user = await userExistInDB(account, 'account')
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
