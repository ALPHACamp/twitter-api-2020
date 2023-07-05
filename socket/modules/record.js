const { emitError } = require('../helper')
const { Chat, User } = require('../../models')

module.exports = async (io, socket, room = null) => {
  try {
    // 有room的是私訊，沒有的是公開，訊息由舊到新排序
    let records = await Chat.findAll({
      // where: { roomId: room },
      include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
      nest: true,
      order: [['timestamp', 'ASC']],
      attributes: ['message', 'timestamp'],
      raw: true
    })
    records = records.length ? records : '尚未聊天過，開始發送訊息吧!'

    // 回傳歷史訊息
    io.emit('server-record', records)
  } catch (err) {
    emitError(socket, err)
  }
}
