const db = require('../models')
const { Op } = require('sequelize')
const { Message } = db
// 登入成功以後，更新上線名單

module.exports = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
  })

  const onlineUser = new Map()

  io.on('connection', async socket => {
    try {
      const user = socket.handshake.query //id,name,avatar,account
      user.id = Number(user.id)
      user.socketId = socket.id
      console.log('a user is connect')

      // 找出未讀訊息數量，傳給前端
      const unReadMessages = await Message.findAndCountAll({
        where: {
          RoomId: { [Op.ne]: 1 },//不等於公開聊天室的
          receiverId: user.id,
          isRead: false,
        }
      });
      io.to(socket.id).emit('total unread', unReadMessages.count)

      require('./public')(io, socket, user)
      require('./private')(io, socket, user)

      socket.on('disconnect', () => {
        console.log('a user disconnected')
      })
    } catch (err) {
      console.warn(err)
    }
  })
}