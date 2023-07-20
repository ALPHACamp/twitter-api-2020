const {
  emitError,
  findUserInPublic,
  findAllSubscribers
} = require('../helper')
const { Subscribe, Notice } = require('../../models')
const { Op } = require('sequelize')

module.exports = async (socket, action, targetId) => {
  try {
    // 確認使用者是否登入
    const currentUser = findUserInPublic(socket.id, 'socketId')
    // 找出目前登入的使用者所有的room
    const rooms = currentUser.rooms

    // 當user新增一筆推文時
    if (action === 'tweet') {
      // 找出當前使用者的所有訂戶
      const subscribers = await findAllSubscribers(currentUser.id)
      console.log('sub:', subscribers)
      // 更新訂戶的newNotice時間
      await Notice.update(
        { newNotice: new Date() },
        {
          where: { userId: { [Op.in]: subscribers } }
        }
      )
    }

    // 對某人的tweet回覆、Like或追蹤某人
    if (['like', 'reply', 'follow'].includes(action)) {
      await Notice.update(
        { newNotice: new Date() },
        {
          where: { userId: targetId }
        }
      )
    }

    // 提醒有新通知
    socket.emit('server-push-notice', 'new notice!')
  } catch (err) {
    emitError(socket, err)
  }
}
