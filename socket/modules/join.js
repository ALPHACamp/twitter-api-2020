const usersInPublic = require('./userOnline')
const {
  emitError,
  userExistInDB,
  findUserIndexInPublic,
  getAllRooms,
  findUserInPublic,
  joinAllRooms
} = require('../helper')

module.exports = async (io, socket, userId) => {
  try {
    // Get new User data, if can't find will throw error
    const user = await userExistInDB(userId, 'id')
    const index = await findUserIndexInPublic(userId, 'id')
    const rooms = await getAllRooms(userId)

    // clear timeout if any
    const userOnList = findUserInPublic(userId, 'id', false)
    if (userOnList?.timeout) {
      console.log('使用者已經恢復連線 取消timeout')
      clearTimeout(userOnList.timeout)
      delete userOnList.timeout
    }

    // update
    user.socketId = socket.id
    user.rooms = rooms

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
  } catch (err) {
    emitError(socket, err)
  }
}
