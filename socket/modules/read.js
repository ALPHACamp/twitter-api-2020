const { emitError } = require('../helper')
const { Read } = require('../../models')

module.exports = async (socket, roomId, userId) => {
  try {
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
    socket.emit('server-read', `reading room ${roomId}`)
    console.log(`user id ${userId} read ${roomId}`)
  } catch (err) {
    emitError(socket, err)
  }
}
