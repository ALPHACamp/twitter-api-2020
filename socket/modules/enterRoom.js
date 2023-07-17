const { emitError, findUserInPublic, getAllRooms } = require('../helper')
const readEvent = require('./read.js')
const leaveRoom = require('./leaveRoom')

module.exports = async (socket, roomId) => {
  try {
    // 這功能不會用來建立新的房間，使用者需要先 getRoom 成功建立房間
    // 之後才能 enterRoom

    // check user Id
    const user = findUserInPublic(socket.id, 'socketId')

    // if user belong to that room
    const rooms = await getAllRooms(user.id)
    const hasRoom = rooms.some(room => room === roomId)
    if (!hasRoom) throw new Error('You do not have that room, use getRoom first')

    // cancel the last enter room's
    if (user.currentRoom === roomId) return
    // leave last room if any
    if (user.currentRoom && user.currentRoom !== roomId) {
      leaveRoom(socket)
    }

    // add user's CurrentRoom
    user.currentRoom = roomId

    // read once
    readEvent(socket, roomId, user.id)
    socket.emit('server-enter-room', `enter room ${roomId}, read once`)
  } catch (err) {
    emitError(socket, err)
  }
}
