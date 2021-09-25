const db = require('../models')
const sequelize = require('sequelize')
const { Room, Message, User, RoomUser } = db


module.exports = (io, socket, loginUser) => {

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
      // 加入房間
      socket.join(room.id)
      await RoomUser.create({ where: { RoomId: room.id, UserId: loginUser.id } })

      io.to(room.id).emit('join room success', room.id)
      // TODO:更新聊天紀錄人員列表，回傳的使用者資料排除登入使用者的，只回傳對方資料
      let chatList = await Room.findAll({
        raw: true, nest: true,
        attributes: [],
        where: {
          [sequelize.Op.or]: [
            { joinerId: loginUser.id },
            { creatorId: loginUser.id }
          ]
        },
        include: [{
          model: User,
          as: 'Creator',
          attributes: ['id', 'account', 'avatar', 'name']
        },
        {
          model: User,
          as: 'Joiner',
          attributes: ['id', 'account', 'avatar', 'name']
        }
        ]
      }) //TODO:根據聊天紀錄排序，越新的越上面，或是說先排沒已讀的在最上，在根據時間排序
      // 只回傳聊天對象的個人資料。 [{user: {個人資料}}, {user: {個人資料}}]
      chatList.forEach(data => {
        if (data.Creator.id === loginUser.id) {
          delete data.Creator
          // 沒被刪掉的就是聊天對象，將key改為user
          delete Object.assign(data, { ['user']: data['Joiner'] })['Joiner']
        } else {
          // 如果A不是登入者，就是聊天對象，此時刪掉B，並將key(A)改為user
          delete data.Joiner
          delete Object.assign(data, { ['user']: data['Creator'] })['Creator']
        }
      })
      console.log(chatList)
      io.to(room.id).emit('chat member list', chatList)

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


    } catch (err) {
      console.warn(err)
    }
  })
}