const db = require('../models')
const { User, Message, RoomUser } = db
const { getRoomUsers } = require('../tools/helper')


module.exports = (io) => {
  const public = io.of('/public')

  public.on('connection', async (socket) => {
    try {
      const user = socket.handshake.query
      user.socketId = socket.id

      socket.join('public')
      public.emit('connection', '連線成功')
      publicRoom = public.to('public')

      // 先判斷使用者是否有在這個房間過
      const result = await RoomUser.findAll({
        raw: true, nest: true,
        where: {
          RoomId: 1,
          UserId: user.id
        }
      })
      if (!result.length) {
        publicRoom.emit('connect status', `${user.name} 上線`)
      }

      // 更新在線名單
      await RoomUser.create({
        RoomId: 1,
        UserId: user.id,
        socketId: user.socketId
      })

      // 傳送public在線的名單
      const userList = await getRoomUsers(1) // TODO: 1改為room name而非room id?
      publicRoom.emit('online list', userList)

      // 傳入房間歷史訊息
      const messages = await Message.findAll({
        raw: true, nest: true,
        attributes: ['content', 'createdAt'],
        where: { RoomId: 1 }, //TODO 房間要改？
        include: {
          model: User,
          attributes: ['id', 'avatar']
        },
        order: [['createdAt', 'ASC']]
      })
      publicRoom.emit('history', messages)

      socket.on('send message', async msg => {
        try {
          const sendUser = await User.findOne({
            where: { id: user.id },
            attributes: ['id', 'name', 'avatar', 'account']
          })
          // 加入到歷史訊息
          await Message.create({
            content: msg,
            RoomId: 1,// TODO:房間id 1 ok?
            UserId: user.id
          })

          const data = {
            message: msg,
            user: sendUser.toJSON() //回傳訊息及是誰傳的
          }
          publicRoom.emit('updated message', data)
        } catch (err) {
          console.warn(err)
        }
      })
      // TODO:如果server重啟，要自動清空roomUser
      socket.on('disconnect', async () => {
        try {
          // 下線
          socket.leave("public")
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
            publicRoom.emit('connect status', `${user.name} 離線`)
          }

          // 回傳在線名單
          const userList = await getRoomUsers(1)
          publicRoom.emit('online user', userList)
        } catch (err) {
          console.warn(err)
        }
      })
    } catch (err) {
      console.warn(err)
    }
  })
}