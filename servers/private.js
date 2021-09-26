const db = require('../models')
const sequelize = require('sequelize')
const { Room, Message, User, RoomUser } = db
const { emitChatList } = require('../tools/helper')

module.exports = (io, socket, loginUser) => {

  socket.on('join private page', async () => {
    try {
      await emitChatList(io, loginUser)
    } catch (err) {
      console.warn(err)
    }
  })
  // 第一次跟人聊天的時候，也要更新聊天列表
  socket.on('join room', async targetUserId => {
    try {
      // 找房間or創新房間
      let [room, created] = await Room.findOrCreate({
        attributes: ['id'],
        where: {
          [sequelize.Op.and]: sequelize.literal(`(Room.creatorId = ${loginUser.id} OR Room.creatorId =${targetUserId})AND (Room.joinerId =${loginUser.id} OR Room.joinerId = ${targetUserId})`)
        },
        defaults: {
          creatorId: loginUser.id,
          joinerId: targetUserId
        }
      })
      room = room.get({ plain: true })

      // 如果是第一次聊天,更新聊天列表
      if (created) {
        await emitChatList(io, loginUser)
      }

      // 加入房間
      socket.join(room.id)
      await RoomUser.create({ RoomId: room.id, UserId: loginUser.id, socketId: loginUser.socketId })

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

      socket.on('typing', () => {
        socket.emit('typing', `${user.name}正在輸入...`)
      })

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

      // TODO: 斷線以後也要離開
      socket.on('leave room', async () => {
        try {
          await RoomUser.destroy({ where: { RoomId: room.id, UserId: loginUser.id } })
          socket.leave(room.id)
        } catch (err) {
          console.warn(err)
        }
      })

    } catch (err) {
      console.warn(err)
    }
  })
}