const { emitError, findUserInPublic } = require('../helper')
const readEvent = require('./read')

module.exports = async socket => {
  try {
    // find user
    const user = findUserInPublic(socket.id, 'socketId')

    // not in room
    if (!user.currentRoom) throw new Error('You are not currently in a room')

    // read again before leave
    readEvent(socket, user.currentRoom, user.id)

    // cancel currentRoom
    socket.emit('server-leave-room', `leave room ${user.currentRoom}, read once`)
    delete user.currentRoom
  } catch (err) {
    emitError(socket, err)
  }
}
