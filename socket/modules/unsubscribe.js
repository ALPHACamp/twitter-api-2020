const { userExistInDB, findUserInPublic, emitError } = require('../helper')
const { Subscribe } = require('../../models')

module.exports = async (socket, targetId) => {
  try {
    // 檢查 使用者在不在上線名單上
    const userOnline = findUserInPublic(socket.id, 'socketId')

    // find user and targetUser in DB (check exist)
    const user = await userExistInDB(userOnline.id, 'id')
    const targetUser = await userExistInDB(targetId, 'id')

    // 不能取消訂閱自己
    if (user.id === targetUser.id) throw new Error('不能取消訂閱自己！')

    // find Subscribe exist
    const subscribe = await Subscribe.findOne({
      where: { fromUserId: user.id, toUserId: targetUser.id }
    })

    // create new subscribe record
    if (subscribe) {
      await subscribe.destroy()
      socket.emit('server-unsubscribe', '成功取消訂閱使用者！')
      return
    }

    socket.emit('server-unsubscribe', '失敗，你沒有訂閱這名使用者！')
  } catch (err) {
    emitError(socket, err)
  }
}
