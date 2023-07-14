const usersInPublic = require('./userOnline')
const { userExistInDB, findUserInPublic, findUserIndexInPublic, emitError } = require('../helper')

module.exports = async (io, socket, userId) => {
  try {
    const user = await userExistInDB(userId, 'id')

    // 檢查 使用者在不在上線名單上 (暫時傳錯誤給postman)
    const userOnline = findUserInPublic(userId, 'id', false)
    if (!userOnline) throw new Error('使用者已經不在上線名單上！(已下線)')

    // 從上線名單移除使用者
    usersInPublic.splice(findUserIndexInPublic(userId, 'id'), 1)

    // 給全部使用者 更新的上線名單
    socket.broadcast.emit('server-update', usersInPublic)
    // broadcast 下線訊息
    socket.broadcast.emit('server-leave', `${user.name} 下線`)
    return
  } catch (err) {
    // 因為使用者已經不在線上，有沒有要處理在考慮
    // 傳給 postman
    emitError(socket, err)
  }
}
