const { Message } = require('../models')

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
          roomName: { [Op.or]: [{ [Op.like]: `%R${currentUserId}` }, { [Op.like]: `${currentUserId}R%` }] }
        },
        { isRead: false },
        { [Op.not]: [{ UserId }] }]
      },
    })
    return notRead
  },

  changeToRead: async (roomName, UserId) => {
    await Message.update({ isRead: true }, {
      where: {
        [Op.and]: [roomName, { isRead: false }, { [Op.not]: [{ UserId }] }]
      }
    })
  }
}
