const db = require('../models')
const { User, Message, RoomUser } = db
const { getRoomUsers } = require('../tools/helper')


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
        io.to(1).emit('connect status', `${user.name} 上線`)
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
      io.to(1).emit('history', messages)

      socket.on('typing', () => {
        socket.emit('typing', `${user.name}正在輸入...`)
      })

      socket.on('send message', async msg => {
        try {
          const sendUser = await User.findOne({
            where: { id: user.id },
            attributes: ['id', 'name', 'avatar', 'account']
          })
          // 加入到歷史訊息
          await Message.create({
            content: msg,
            RoomId: 1,
            senderId: user.id,
            receiver: null,
          })
          // 包成物件傳到前端，訊息內容＋發送者的個人資料
          const data = {
            message: msg,
            user: sendUser.toJSON()
          }
          io.to(1).emit('updated message', data)
        } catch (err) {
          console.warn(err)
        }
      })
      // TODO:如果server重啟，要自動清空roomUser
      socket.on('disconnect', async () => {
        try {
          // 下線
          socket.leave(1)
          await RoomUser.destroy({
            where: {
              socketId: user.socketId,
              RoomId: 1
            }
          })
          // TODO:跟上線邏輯很像，要重構
          // 離線後，確認房間是否還有user，沒的話才傳
          const result = await RoomUser.findAll({
            raw: true, nest: true,
            where: {
              RoomId: 1,
              UserId: user.id
            }
          })
          if (!result.length) {
            io.to(1).emit('connect status', `${user.name} 離線`)
          }

          // 回傳在線名單
          const userList = await getRoomUsers(1)
          io.to(1).emit('online user', userList)
        } catch (err) {
          console.warn(err)
        }
      })
    } catch (err) {
      console.warn(err)
    }
  })
}