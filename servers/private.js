const db = require('../models')
const sequelize = require('sequelize')
const room = require('../models/room')
const { Room, Message, User, RoomUser } = db


module.exports = (io, socket, loginUser) => {

  socket.on('join room', async targetUserId => {
    try {
      // 找房間or創新房間
      let room = await Room.findOne({
        attributes: ['id'],
        where: {
          [sequelize.Op.and]: sequelize.literal(`(Room.creatorId = ${loginUser.id} OR Room.creatorId =${targetUserId})AND (Room.joinerId =${loginUser.id} OR Room.joinerId = ${targetUserId})`)
        }
      })
      if (room === null) {
        room = await Room.create({
          creatorId: loginUser.id,
          joinerId: targetUserId,
        })
      }
      room = room.toJSON()

      // 加入房間
      socket.join(room.id)
      await RoomUser.create({ where: { RoomId: room.id, UserId: loginUser.id } })

      io.to(room.id).emit('join room success', room.id)

      // 將該房間傳給我的訊息改為已讀
      await Message.update({
        isRead: true
      }, {
        where: {
          RoomId: room.id,
          receiverId: loginUser.id
        }
      })

      //傳入歷史訊息
      const messages = await Message.findAll({
        raw: true, nest: true,
        attributes: ['content', 'createdAt'],
        where: { RoomId: room.id },
        include: {
          model: User,
          as: 'Senders',
          attributes: ['id', 'avatar']
        },
        order: [['createdAt', 'ASC']]
      })

      // 伺服器向房間更新歷史訊息
      io.to(room.id).emit('history', messages)
      // 接發訊息
      socket.on('private message', async message => {
        // 判斷對方有無在房間，如有，isRead改為true
        // TODO:既然已經在加入房間時更新訊息，是否這裡就不需要了，應該不行，如果同時在線就還是未讀吧？
        const isTargetOnline = await RoomUser.findOne({
          where: {
            RoomId: room.id,
            UserId: targetUserId
          }
        })
        const isRead = isTargetOnline ? true : false
        // 創建訊息
        await Message.create({
          senderId: loginUser.id,
          receiverId: targetUserId,
          RoomId: room.id,
          content: message,
          isRead
        })
        // 更新訊息給前端
        io.to(room.id).emit('update message', { message, user: loginUser })
      })


    } catch (err) {
      console.warn(err)
    }
  })
}