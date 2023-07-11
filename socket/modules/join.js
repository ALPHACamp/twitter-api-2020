const usersInPublic = require('./userOnline')
const {
  userExistInDB,
  emitError,
  findUserInPublic,
  getAllRooms,
  joinAllRooms
} = require('../helper')

module.exports = async (io, socket, account) => {
  try {
    // 檢查 使用者是否存在上線名單中
    let userOnList = findUserInPublic(account, 'account', false)

    // 恢復連線
    if (userOnList?.timeout) {
      // 使用者 reconnect
      console.log('使用者已經恢復連線 取消timeout')
      clearTimeout(userOnList.timeout)
      // 更新使用者資訊
      userOnList.socketId = socket.id
      userOnList.rooms = await getAllRooms(userOnList.id)

      delete userOnList.timeout
    }

    // 新上線
    if (!userOnList) {
      // 使用者上線
      console.log('使用者上線')
      const user = await userExistInDB(account, 'account')
      // 更新使用者資訊
      user.socketId = socket.id
      user.rooms = await getAllRooms(user.id)

      // 給全部使用者 更新的上線名單
      usersInPublic.push(user)
      // 更新 userOnList
      userOnList = findUserInPublic(account, 'account', false)
      // 傳遞名單
      io.emit('server-update', usersInPublic)
      // broadcast 上線訊息
      socket.broadcast.emit('server-join', `${user.name} 上線`)
    }

    // 把使用者加入擁有的rooms中
    // 重複的房間會自動忽略
    const rooms = await getAllRooms(userOnList.id)
    joinAllRooms(socket, rooms) // join rooms

    console.log('已經把使用者join rooms')
    console.log('socket.rooms:', socket.rooms)
  } catch (err) {
    emitError(socket, err)
  }
}
