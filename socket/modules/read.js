const { emitError } = require('../helper')
const { Read } = require('../../models')

module.exports = async (socket, roomId, userId) => {
  try {
    const lastRead = new Date()

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
    await read.update({ lastRead })
    socket.emit('server-read', `user id ${userId} read room ${roomId}`)
    console.log(`user id ${userId} read room ${roomId}`)
  } catch (err) {
    emitError(socket, err)
  }
}
