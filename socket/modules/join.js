const usersInPublic = require('./userOnline')
const { userExist, isUserInPublic, emitError } = require('../helper')

module.exports = async (io, socket, userAccount) => {
  try {
    // 檢查 使用者存在
    const user = await userExist(userAccount)

    // 檢查 使用者已經在上線名單上 (暫時傳錯誤給postman)
    if (isUserInPublic(user)) throw new Error('使用者已經在上線名單上！(已上線)')

    // add socket id
    user.socketId = socket.id

    // 使用者加入上線名單
    usersInPublic.push(user)

    // 給全部使用者 更新的上線名單
    io.emit('server-update', usersInPublic)
    // broadcast 上線訊息
    socket.broadcast.emit('server-join', `${user.name} 上線`)
    return
  } catch (err) {
    emitError(socket, err)
  }
}
