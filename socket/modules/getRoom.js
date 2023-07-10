const { emitError, findUserInPublic, userExistInDB, getAllRooms, joinAllRooms } = require('../helper')
const { Room } = require('../../models')
const { Op } = require('sequelize')

module.exports = async (io, socket, targetId) => {
  try {
    console.log('client get room')

    // get user Id
    const currentUser = findUserInPublic(socket.id, 'socketId')
    console.log('currentUser:', currentUser)

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
    // 傳遞房間給使用者
    socket.emit('server-get-room', room.id.toString())

    // 把使用者加入房間
    const userRooms = await getAllRooms(currentUserId)
    joinAllRooms(socket, userRooms)

    // 檢查目標是否在線上
    const targetUser = findUserInPublic(targetId, 'id')
    if (!targetUser) return

    // 在線上就找到目標socket，找出所屬房間，加入房間，更新資訊
    const targetSocket = io.sockets.sockets.get(targetUser.socketId)
    const targetRooms = await getAllRooms(targetId)
    joinAllRooms(targetSocket, targetRooms)
    targetUser.rooms = targetRooms
  } catch (err) {
    emitError(socket, err)
  }
}
