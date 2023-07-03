const usersInPublic = require('./userOnline')
const { emitError } = require('../helper')

module.exports = async (io, socket, reason) => {
  try {
    console.log(`Disconnected: ${socket.id} disconnected due to ${reason}`)
    // find user in public with socket.id
    const socketId = socket.id

    const index = usersInPublic.findIndex(user => user.socketId === socketId)
    console.log(index)

    if (index !== -1) {
      const user = usersInPublic[index]

      // 從上線名單移除使用者
      usersInPublic.splice(index, 1)

      // 給全部使用者 更新的上線名單
      io.emit('server-update', usersInPublic)
      // broadcast 下線訊息
      socket.broadcast.emit('server-leave', `${user.name} 下線`)
      console.log('all done')
    }
  } catch (err) {
    emitError(socket, err)
  }
}
