const usersInPublic = require('./userOnline')
const { emitError, findUserInPublic, findUserIndexInPublic } = require('../helper')
const leaveEvent = require('./leave')

const timeoutTime = 5000 // 5sec

module.exports = async (socket, reason) => {
  try {
    // 確認者用者在 上線名單中
    const user = findUserInPublic(socket.id, 'socketId', false)
    console.log('disconnect user:', user)
    // 找不到使用者代表使用者有正常下線 (使用 client-leave)
    if (!user) return

    // 找到使用者，代表使用者可能斷線，或是刷新頁面
    const timeout = setTimeout(() => {
      leaveEvent(socket, user.id)
      console.log(`使用者 ${user.account} 已斷線：${reason}`)
    }, timeoutTime)

    // 把這筆 timeout 放入使用者裡面給 join 使用
    const index = findUserIndexInPublic(user.account, 'account')
    usersInPublic[index].timeout = timeout
    console.log(`使用者 ${user.account} 被放入timeout裡面(${timeoutTime / 1000}秒開始)`)
  } catch (err) {
    emitError(socket, err)
  }
}
