const { emitError, findUserInPublic } = require('../helper')

module.exports = async (socket, roomId) => {
  try {
    // find user
    const user = findUserInPublic(socket.id, 'socketId')

    console.log('currentRoom:', user.currentRoom, 'roomId:', roomId)
    console.log('currentRoom:', typeof user.currentRoom, 'roomId:', typeof roomId)

    // not in room
    if (!user.currentRoom) throw new Error('You are not currently in a room')
    if (user.currentRoom !== roomId) throw new Error(`You are not currently in ${roomId} room`)

    // cancel reading
    if (user.currentRoom && user.readInterval) {
      clearInterval(user.readInterval)
      delete user.readInterval
      delete user.currentRoom
      socket.emit('server-leave-room', `leave room ${roomId}, stop reading`)
      return
    }
    throw new Error('leaveRoom: can not clear interval for user.readInterval')
  } catch (err) {
    emitError(socket, err)
  }
}
