const { emitError } = require('../helper')
const { Chat, User, Room } = require('../../models')

module.exports = async (socket, roomId) => {
  try {
    // 如未傳入值，預設為public room
    if (!roomId) {
      const room = await Room.findOne({ attributes: ['id'], raw: true })
      roomId = room.id
    } else {
      const room = await Room.findOne({ where: { id: roomId } })
      if (!room) throw new Error('此聊天室不存在!')
    }
    // 訊息由舊到新排序
    let records = await Chat.findAll({
      where: { roomId },
      include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
      nest: true,
      order: [['timestamp', 'ASC']],
      attributes: ['message', 'roomId', 'timestamp'],
      raw: true
    })
    records = records.length ? records : '尚未聊天過，開始發送訊息吧!'

    // 回傳歷史訊息
    socket.emit('server-record', records)
  } catch (err) {
    emitError(socket, err)
  }
}
