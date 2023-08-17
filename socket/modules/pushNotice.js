const {
  emitError,
  findUserInPublic,
  findAllSubscribersUserId,
  checkNotice,
  userExistInDB
} = require('../helper')
const { Notice } = require('../../models')
const { Op } = require('sequelize')
const usersOnline = require('../modules/userOnline')
const getNotice = require('../modules/getNotice')

module.exports = async (socket, action, targetId) => {
  targetId = targetId.toString()
  try {
    // 確認使用者是否登入
    const currentUser = findUserInPublic(socket.id, 'socketId')
    const actions = ['tweet', 'like', 'reply', 'follow', 'subscribe']

    if (actions.includes(action)) {
      // 當user新增一筆推文時
      if (action === 'tweet') {
        // 找出當前使用者的所有訂戶
        const subscribers = await findAllSubscribersUserId(currentUser.id)
        // 更新訂戶的newNotice時間
        await Notice.update(
          { newNotice: new Date() },
          {
            where: { userId: { [Op.in]: subscribers } }
          }
        )
        console.log(`NewNotices of userId:${currentUser.id}'s subscribers have updated.`)

        usersOnline.forEach(async u => {
          // find online subscribers
          if (subscribers.includes(u.id)) {
            // send new notice message
            if (u.currentRoom && u.currentRoom === 'notice') {
              getNotice(socket, u.socketId)
            }
            // renew unreadNotice status
            u.unreadNotice = await checkNotice(u.id)
            socket.to(u.socketId).emit('server-push-notice', 'new notice!')
            socket.to(u.socketId).emit('server-update', usersOnline)
          }
        })
      } else {
        // 對某人的tweet reply、like、follow或subscribe某人
        if (!targetId) throw new Error('targetId is required!')
        const isUser = await userExistInDB(targetId, 'id')
        if (!isUser) throw new Error('The user does not exist!')

        // 更新targetUser的notice
        await Notice.update(
          { newNotice: new Date() },
          {
            where: { userId: targetId }
          }
        )
        console.log(`NewNotice of userId:${targetId} has updated.`)

        const targetUserOnline = usersOnline.find(u => u.id.toString() === targetId)
        console.log({ action, targetId, targetUserOnline, usersOnline })
        // if targetUser online, send new notice message
        if (targetUserOnline) {
          let text = 'if targetUserOnline = true'
          if (targetUserOnline.currentRoom && targetUserOnline.currentRoom === 'notice') {
            // if user in notice, trigger getNotice
            getNotice(socket, targetUserOnline.socketId)
            text = '測試有進入此區'
          }
          // renew unreadNotice status
          targetUserOnline.unreadNotice = await checkNotice(targetUserOnline.id)

          socket.to(targetUserOnline.socketId).emit('server-push-notice', 'new notice!' + text)
          socket.to(targetUserOnline.socketId).emit('server-update', usersOnline)
        }
      }
    } else {
      throw new Error(`Action: ${action} didn't exist!`)
    }
  } catch (err) {
    emitError(socket, err)
  }
}
