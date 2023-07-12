const { emitError, findUserInPublic } = require('../helper')
const { Chat, User } = require('../../models')
const { Op } = require('sequelize')

module.exports = async (io, socket) => {
  try {
    // 確認使用者是否登入
    const currentUser = findUserInPublic(socket.id, 'socketId')

    // 找出目前登入的使用者所有的room
    const rooms = currentUser.rooms

    // 根據roomId去搜尋message，同一個roomId只留最新一筆訊息
    const newMessage = await Chat.findAll({
      where: {
        roomId: { [Op.in]: rooms }
      },
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      attributes: ['id', 'message', 'roomId', 'timestamp'],
      order: [['id', 'DESC']] // 最新的訊息在最上方
    })
    // 暫時想不到直接在DB處理的方式，先抓出來處理
    const newMessageData = []
    newMessage.forEach(m => {
      const roomIdExist = newMessageData.some(d => d.roomId === m.roomId)
      if (!roomIdExist) newMessageData.push(m.toJSON())
    })

    // 以上做完要在做顯示未讀訊息的數量
    const unreadMessage = 0
    // 回傳最新訊息
    io.emit('server-new-message', newMessageData)
  } catch (err) {
    emitError(socket, err)
  }
}
