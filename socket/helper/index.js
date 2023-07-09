// 用來驗證一些基本問題

const { User, Room } = require('../../models')
const usersInPublic = require('../modules/userOnline')
const { Op } = require('sequelize')

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
    console.log('getAllRoom:', rooms)
    const roomsArray = rooms.map(room => room.id)
    return roomsArray
  },
  joinAllRooms: (socket, rooms) => {
    rooms.forEach(roomId => {
      socket.join(roomId.toString())
    })
  }
}
module.exports = helper
