const db = require('../models')
const { Op } = require('sequelize')
const { Message, RoomUser } = db
const { removeClientFromMap, addClientToMap, getRoomUsers, leavePublicRoom, leaveAllPrivateRoom } = require('../tools/helper')

const PUBLIC_ROOM_ID = 1

module.exports = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    allowEIO3: true
  })
  // 登入成功以後，更新上線名單
  const userSocketIdMap = new Map() //1(userId) => [ ‘socketId1234’, ‘socketIdabcde’]
  io.on('connection', async socket => {
    try {
      const user = socket.handshake.query //id,name,avatar,account
      user.id = Number(user.id)
      user.socketId = socket.id
      // TODO:將更新在線名單這件事包成function
      addClientToMap(user.id, user.socketId, userSocketIdMap)
      //將在線名單傳給前端，跟聊天名單做比對。
      const onlineUser = Array.from(userSocketIdMap, ([id]) => ({ id })) //將Map轉為陣列
      io.emit('online user list', onlineUser)
      console.log('a user is connect')

      // 找出未讀訊息數量，傳給前端
      const unReadMessages = await Message.findAndCountAll({
        where: {
          RoomId: { [Op.ne]: PUBLIC_ROOM_ID },
          receiverId: user.id,
          isRead: false,
        }
      });
      io.to(socket.id).emit('total unread', unReadMessages.count)

      require('./public')(io, socket, user)
      require('./private')(io, socket, user)
      require('./notification')(io, socket, user, userSocketIdMap)

      socket.on('disconnect', async () => {
        try {
          // TODO:將更新在線名單這件事包成function
          // 更新在線名單
          removeClientFromMap(user.id, user.socketId, userSocketIdMap)
          //將在線名單傳給前端，跟聊天名單做比對。
          const onlineUser = Array.from(userSocketIdMap, ([id]) => ({ id })) //將Map轉為陣列
          io.emit('online user list', onlineUser)

          if (socket.rooms.has(PUBLIC_ROOM_ID)) {
            io.in(user.socketId).socketsLeave(PUBLIC_ROOM_ID);
            await leavePublicRoom(io, user)
          }

          await leaveAllPrivateRoom(io, user)
          // 回傳在線名單給公開聊天室
          const userList = await getRoomUsers(PUBLIC_ROOM_ID)
          io.to(PUBLIC_ROOM_ID).emit('online list', userList)
          console.log('a user disconnected')
        } catch (err) {
          console.warn(err)
        }
      })
    } catch (err) {
      console.warn(err)
    }
  })
}