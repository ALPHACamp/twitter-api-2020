const db = require('../models')
const { User, Message, RoomUser } = db
const { getRoomUsers, leavePublicRoom, updateMessage } = require('../tools/helper')


module.exports = (io, socket, user) => {
  socket.on('join public', async () => {
    try {
      socket.join(1) //連線者加入公開房間

      // 先判斷使用者是否有在這個房間過
      const result = await RoomUser.findAll({
        raw: true, nest: true,
        where: {
          RoomId: 1,
          UserId: user.id
        }
      })
      if (!result.length) {
        // socket伺服器向公開房間發送消息
        io.to(1).emit('connect status', `${user.name} 進入聊天室`)
      }

      // 更新在線名單
      await RoomUser.create({
        RoomId: 1,
        UserId: user.id,
        socketId: user.socketId
      })

      // 傳送public在線的名單
      const userList = await getRoomUsers(1)
      io.to(1).emit('online list', userList)
      // TODO:待刪除，已改成API
      // 傳入房間歷史訊息
      const messages = await Message.findAll({
        raw: true, nest: true,
        attributes: ['id', 'content', 'createdAt'],
        where: { RoomId: 1 },
        include: {
          model: User,
          as: 'Senders',
          attributes: ['id', 'avatar']
        },
        order: [['createdAt', 'ASC']]
      })

      // 伺服器向房間1更新歷史訊息
      io.to(user.socketId).emit('history', messages)

    } catch (err) {
      console.warn(err)
    }
  })

  socket.on('send message', async message => {
    try {
      await updateMessage(io, message, user, 1)
    } catch (err) {
      console.warn(err)
    }
  })

  socket.on('typing', () => {
    socket.emit('typing', `${user.name}正在輸入...`)
  })

  // TODO:如果server重啟，要自動清空roomUser
  socket.on('leave public', async (msg) => {
    try {
      // 下線
      socket.leave(1)
      await leavePublicRoom(io, user)

      // 回傳在線名單
      const userList = await getRoomUsers(1)
      io.to(1).emit('online list', userList)
    } catch (err) {
      console.warn(err)
    }
  })
}