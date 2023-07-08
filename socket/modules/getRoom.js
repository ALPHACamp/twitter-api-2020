const { emitError, findUserInPublic, userExistInDB } = require('../helper')
const { Room } = require('../../models')
const { Op } = require('sequelize')

module.exports = async (socket, targetId) => {
  try {
    // get user Id
    const currentUser = findUserInPublic(socket.id, 'socketId')
    if (!currentUser) throw new Error('you need to use client-join first')
    const currentUserId = currentUser.id

    // check if both id are the same
    if (currentUserId.toString() === targetId) throw new Error('both id are the same')

    // check target exist in DB
    await userExistInDB(targetId, 'id')

    // find room.id
    let room = await Room.findOne({
      where: {
        [Op.or]: [
          { userOneId: currentUserId, userTwoId: targetId },
          { userOneId: targetId, userTwoId: currentUserId }
        ]
      },
      attributes: ['id']
    })

    // 沒有房間就做一個出來
    if (!room) {
      room = await Room.create({
        userOneId: currentUserId,
        userTwoId: targetId
      })
    }
    socket.emit('server-get-room', room.id)
  } catch (err) {
    emitError(socket, err)
  }
}
