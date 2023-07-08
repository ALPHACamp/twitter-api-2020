// 用來驗證一些基本問題
const { User } = require('../../models')
const usersInPublic = require('../modules/userOnline')

const helper = {
  // user in DB
  userExistInDB: async (input, typeString) => {
    if (typeString === 'id') input = Number(input)
    const whereCondition = { [typeString]: input }
    // if typeString = id, but input is string, Error of NaN

    const user = await User.findOne({
      where: whereCondition,
      attributes: ['id', 'account', 'name', 'avatar']
    })
    if (!user) throw new Error('使用者不存在！')
    return user.toJSON()
  },
  // user online
  findUserIndexInPublic: (input, typeString) => {
    if (typeString === 'id') input = Number(input)
    const index = usersInPublic.findIndex(user => user[typeString] === input)
    return index
  },
  findUserInPublic: (input, typeString) => {
    console.log('findUserInPublic')
    if (typeString === 'id') input = Number(input)
    return usersInPublic.find(user => user[typeString] === input)
  },
  hasMessage: message => {
    const m = message.trim()
    if (m.length === 0) throw new Error('沒有打任何訊息！')
    return m
  },
  emitError: (socket, err) => {
    console.log(`Server Error: ${err.message}`)
    socket.emit('server-error', `Error: ${err.message}`)
  }
}
module.exports = helper
