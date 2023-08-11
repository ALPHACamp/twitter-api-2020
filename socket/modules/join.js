const usersInPublic = require('./userOnline')
const {
  emitError,
  userExistInDB,
  findUserIndexInPublic,
  getAllRooms,
  findUserInPublic,
  joinAllRooms,
  checkNotice
} = require('../helper')

module.exports = async (io, socket, userId) => {
  try {
    // Get new User data, if can't find will throw error
    const user = await userExistInDB(userId, 'id')
    const index = await findUserIndexInPublic(userId, 'id')
    const rooms = await getAllRooms(userId)
    const unreadNotice = await checkNotice(userId)

    // 檢查 斷線/重複登入
    const userOnList = findUserInPublic(userId, 'id', false)
    // 斷線
    if (userOnList?.timeout) {
      console.log('使用者已經恢復連線 取消timeout')
      clearTimeout(userOnList.timeout)
      delete userOnList.timeout
    } else if (userOnList) {
      // 重複登入
      throw new Error('該使用者已經在線上！')
    }

    // update
    user.socketId = socket.id
    user.rooms = rooms
    user.unreadNotice = unreadNotice
    user.currentRoom =
      userOnList?.currentRoom === undefined ? "" : userOnList.currentRoom

    if (index === -1) {
      usersInPublic.push(user)
      socket.broadcast.emit('server-join', `${user.name} 上線`)
      console.log('使用者新增到上線名單')
    } else {
      usersInPublic[index] = user
      console.log('使用者上線名單資料更新')
    }

    joinAllRooms(socket, rooms)
    console.log('已經把使用者join rooms:', socket.rooms)

    // 更新上線名單
    io.emit('server-update', usersInPublic)
    console.log(usersInPublic)
    console.log(user)
  } catch (err) {
    emitError(socket, err)
  }
}
