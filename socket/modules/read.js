const { emitError, findUserInPublic, getAllRooms } = require('../helper')
const { Read } = require('../../models')

module.exports = async (socket, roomId) => {
  try {
    // 這功能不會用來建立新的房間，使用者需要先 getRoom 成功建立房間
    // 才能使用 read

    // check user Id
    const user = findUserInPublic(socket.id, 'socketId')
    const userId = user.id

    // if user belong to that room
    const rooms = await getAllRooms(userId)
    const hasRoom = rooms.some(room => room === roomId)
    if (!hasRoom) throw new Error('You do not have that room, use getRoom first')

    // check Read record exist
    let read = await Read.findOne({
      where: { userId, roomId }
    })

    // create one if not exist
    if (!read) {
      read = await Read.create({
        userId,
        roomId
      })
    }

    // update read
    await read.update({ lastRead: new Date() })

    // 傳遞時間訊息
    read = read.toJSON()
    const readMessage = {
      userId: read.userId,
      roomId: read.roomId,
      time: read.lastRead
    }
    socket.emit('server-read', readMessage)
  } catch (err) {
    emitError(socket, err)
  }
}
