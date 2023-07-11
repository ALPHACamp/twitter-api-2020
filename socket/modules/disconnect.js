const usersInPublic = require('./userOnline')
const { emitError, findUserInPublic, findUserIndexInPublic } = require('../helper')

const timeoutTime = 5000 // 5sec

module.exports = async (io, socket, reason) => {
  try {
    // 確認者用者在 上線名單中
    const user = findUserInPublic(socket.id, 'socketId', false)
    console.log('disconnect user:', user)
    // 找不到使用者代表使用者有正常下線 (使用 client-leave)
    if (!user) return

    // 找到使用者，代表使用者可能斷線，或是刷新頁面
    const timeout = setTimeout(() => {
      // 從上線名單移除使用者 (放在裡面以免期間有其他使用者被刪除搞亂index)
      const index = findUserIndexInPublic(user.account, 'account')
      usersInPublic.splice(index, 1)
      // broadcast 更新的上線名單
      socket.broadcast.emit('server-update', usersInPublic)
      // broadcast 斷線訊息
      socket.broadcast.emit('server-leave', `${user.name} 已經斷線`)
      console.log('使用者已經被移除(使用者斷線)！')
    }, timeoutTime)

    // 把這筆 timeout 放入使用者裡面給 join 使用
    const index = findUserIndexInPublic(user.account, 'account')
    usersInPublic[index].timeout = timeout
    console.log(`使用者已被放入timeout裡面(${timeoutTime / 1000}秒開始)`)
  } catch (err) {
    emitError(socket, err)
  }
}
