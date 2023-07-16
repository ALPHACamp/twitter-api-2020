// 用來驗證一些基本問題
const { User, Room } = require('../../models')
const usersInPublic = require('../modules/userOnline')
const { Op } = require('sequelize')

const helper = {
  // user in DB
  userExistInDB: async (input, typeString) => {
    if (typeString === 'id') input = Number(input)
    const whereCondition = { [typeString]: input }
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
  findUserInPublic: (input, typeString, checkExist = true) => {
    if (typeString === 'id') input = Number(input)
    const currentUser = usersInPublic.find(user => user[typeString] === input)
    // 需不需要檢查存在
    if (!checkExist) return currentUser
    if (!currentUser) throw new Error('you need to use client-join first')
    return currentUser
  },
  filterUsersInPublic: (input, typeString, checkExist = true) => {
    if (typeString === 'id') input = Number(input)
    const users = usersInPublic.filter(user => user[typeString] === input)
    // 需不需要檢查存在
    if (!checkExist) return users
    if (!users) throw new Error(`no user in in your search ${typeString} = ${input}`)
    return users
  },
  hasMessage: message => {
    const m = message.trim()
    if (m.length === 0) throw new Error('沒有打任何訊息！')
    return m
  },
  emitError: (socket, err) => {
    console.log(`Server Error: ${err.message}`)
    socket.emit('server-error', `Error: ${err.message}`)
  },
  getAllRooms: async userId => {
    const rooms = await Room.findAll({
      where: {
        [Op.or]: [
          { userOneId: userId },
          { userTwoId: userId }
        ]
      },
      attributes: ['id'],
      raw: true
    })
    const roomsArray = rooms.map(room => room.id.toString())
    return roomsArray
  },
  joinAllRooms: (socket, rooms) => {
    rooms.forEach(roomId => {
      socket.join(roomId.toString())
    })
  }
}
module.exports = helper
