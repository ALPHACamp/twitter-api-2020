const usersInPublic = require('./userOnline')
const { emitError } = require('../helper')

module.exports = async (io, socket, reason) => {
  try {
    console.log(`Disconnected: ${socket.id} disconnected due to ${reason}`)
    // find user in public with socket.id
    const index = usersInPublic.findIndex(user => user.socketId === socket.id)

    // 如果使用者在上線名單中
    if (index !== -1) {
      const user = usersInPublic[index]

      // 從上線名單移除使用者
      usersInPublic.splice(index, 1)

      // broadcast 更新的上線名單
      socket.broadcast.emit('server-update', usersInPublic)
      // broadcast 下線訊息
      socket.broadcast.emit('server-leave', `${user.name} 下線`)
    }
  } catch (err) {
    emitError(socket, err)
  }
}
