// 用來驗證一些基本問題
const { User } = require('../../models')
const usersInPublic = require('../modules/userOnline')

const findUserIndexInPublic = user => {
  return usersInPublic.findIndex(item => item.account === user.account)
}

const helper = {
  userExist: async userAccount => {
    const user = await User.findOne({
      where: { account: userAccount },
      attributes: ['id', 'account', 'name', 'avatar']
    })
    if (!user) throw new Error('使用者不存在！')
    return user.toJSON()
  },
  isUserInPublic: user => {
    return findUserIndexInPublic(user) !== -1
  },
  isUserIndexInPublic: user => {
    return findUserIndexInPublic(user)
  },
  hasMessage: message => {
    const m = message.trim()
    if (m.length === 0) throw new Error('沒有打任何訊息！')
    return m
  },
  emitError: (socket, err) => {
    socket.emit('server-error', `Error: ${err.message}`)
  }
}
module.exports = helper
