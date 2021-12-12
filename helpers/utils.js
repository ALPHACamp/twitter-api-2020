const { Message } = require('../models')
const { Op } = require('sequelize')

module.exports = {
  createRoomName: (userId, currentId) => {
    const array = [currentId, userId]
    array.sort((a, b) => a - b)
    const RoomName = array.join('R')
    return RoomName
  },

  // 新增訊息到資料庫
  postMessage: async (data, UserId) => {
    const { roomName, text } = data
    if (data.roomName === 'public') {
      const message = (await Message.create({ UserId, text, roomName })).toJSON()
      return message
    } else {
      const message = (await Message.create({ UserId, text, roomName })).toJSON()
      return message
    }
  },

  getNotRead: async (UserId) => {
    const notRead = await Message.count({
      where: {
        [Op.and]: [{
          roomName: { [Op.or]: [{ [Op.like]: `%R${UserId}` }, { [Op.like]: `${UserId}R%` }] }
        },
        { isRead: 0 },
        { [Op.not]: [{ UserId }] }]
      },
    })
    return notRead
  },

  changeToRead: async (roomName, UserId) => {
    await Message.update({ isRead: 1 }, {
      where: {
        [Op.and]: [{ roomName }, { isRead: 0 }, { [Op.not]: [{ UserId }] }]
      }
    })
  }
}
