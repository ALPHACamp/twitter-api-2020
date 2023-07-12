const { emitError, findUserInPublic, getAllRooms } = require('../helper')
const { Read } = require('../../models')

module.exports = async (socket, roomId) => {
  try {
    // 這功能不會用來建立新的房間，使用者需要先 getRoom 成功建立房間
    // 才能使用enterRoom

    // check user Id
    const user = findUserInPublic(socket.id, 'socketId')
    const userId = user.id

    // if user belong to that room
    const rooms = await getAllRooms(userId)
    const hasRoom = rooms.some(room => room === roomId)
    if (!hasRoom) throw new Error('You do not have that room, use getRoom first')

    // check Read record exist
    let read = await Read.findOne({
      where: { roomId }
    })

    // create one if not exist
    if (!read) {
      read = await Read.create({
        userId,
        roomId
      })
    }

    // leaving last room (update lastRead)
    if (user.currentRoom && user.currentRoom !== roomId.toString()) {
      const lastRoomRead = await Read.findOne({
        where: { roomId: Number(user.currentRoom) }
      })
      await lastRoomRead.update({ lastRead: new Date() })
      socket.emit('server-enter-room',
        `${user.account} left room ${user.currentRoom}, time = ${read.lastRead}`)
    }

    // update current room
    user.currentRoom = roomId.toString()
    await read.update({ lastRead: new Date() })

    // 傳遞時間訊息
    read = read.toJSON()
    socket.emit('server-enter-room',
      `${user.account} in room ${user.currentRoom}, time = ${read.lastRead}`)
    console.log(user)
  } catch (err) {
    emitError(socket, err)
  }
}
