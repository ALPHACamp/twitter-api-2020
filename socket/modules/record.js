const { emitError } = require('../helper')
const { Chat, User, Room } = require('../../models')

module.exports = async (io, socket, room = 1) => {
  try {
    // 如果是公開聊天室，找出rooms的第一筆id
    // 資料庫會有跳號問題，所以用room id = 1 找公開聊天室會出錯
    console.log('room:', room)
    if (room === 1) {
      const publicRoom = await Room.findOne()
      console.log('public:', publicRoom)
      room = publicRoom.id
    }

    // 有room的是私訊，沒有的是公開，訊息由舊到新排序
    let records = await Chat.findAll({
      where: { roomId: room },
      include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
      nest: true,
      order: [['timestamp', 'ASC']],
      attributes: ['message', 'roomId', 'timestamp'],
      raw: true
    })
    console.log(records)
    records = records.length ? records : '尚未聊天過，開始發送訊息吧!'

    // 回傳歷史訊息
    io.emit('server-record', records)
  } catch (err) {
    emitError(socket, err)
  }
}
