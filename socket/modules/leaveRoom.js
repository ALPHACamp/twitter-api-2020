const { emitError, findUserInPublic } = require('../helper')

module.exports = async (socket, roomId) => {
  try {
    // find user
    const user = findUserInPublic(socket.id, 'socketId')

    // not in room
    if (!user.currentRoom) throw new Error('You are not currently in a room')
    if (user.currentRoom !== roomId) throw new Error(`You are not currently in ${roomId} room`)

    // cancel currentRoom
    delete user.currentRoom
    socket.emit('server-leave-room', `leave room ${roomId}, stop reading`)
  } catch (err) {
    emitError(socket, err)
  }
}
