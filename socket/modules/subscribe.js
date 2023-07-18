const { userExistInDB, findUserInPublic, emitError } = require('../helper')
const { Subscribe } = require('../../models')

module.exports = async (socket, targetId) => {
  try {
    // 檢查 使用者在不在上線名單上
    const userOnline = findUserInPublic(socket.id, 'socketId')

    // find user and targetUser in DB (check exist)
    const user = await userExistInDB(userOnline.id, 'id')
    const targetUser = await userExistInDB(targetId, 'id')

    // find Subscribe exist
    const subscribe = await Subscribe.findOne({
      where: { fromUserId: user.id, toUserId: targetUser.id }
    })

    // create new subscribe record
    if (!subscribe) {
      await Subscribe.create({
        fromUserId: user.id,
        toUserId: targetUser.id
      })
      socket.emit('server-subscribe', '成功訂閱使用者！')
      return
    }

    socket.emit('server-subscribe', '失敗，你已經訂閱這位使用者了！')
  } catch (err) {
    emitError(socket, err)
  }
}
