let onlineList = {}
let onlineIdList = []
let publicRoomList = []
const db = require('../../models')
const User = db.User
const Chatmate = db.Chatmate
const ChatRecord = db.ChatRecord
const PublicChat = db.PublicChat
const Subscribe = db.Subscribe
const sequelize = db.sequelize
const Unread = db.Unread
const Sequelize = db.Sequelize
const Op = Sequelize.Op


function socketConnection (io) {
  io.on('connection', socket => {
    socket.on('connectServer', (userId) => {

      // 建立上線用戶表
      onlineList[userId] = socket
      onlineIdList.push(userId)

      // 取出該用戶所有聊天室
      Chatmate.findAll({
        raw: true,
        where: {
          [Op.or]: [
            { userAId: { [Op.eq]: userId } },
            { userBId: { [Op.eq]: userId } }
          ]
        }})
        .then(userChatrooms => {
          // 將該使用者直接加入所有房間
          userChatrooms.map(item => {
            socket.join(item)
            socket.broadcast.to(item).emit('personal-online-notice', userId)
          })
        })
      
      // 取出該用戶所有訂閱channel
      Subscribe.findAll({
        raw: true,
        where: { subscribing: { [Op.eq]: userId } }
      })
      .then(subscribeChannel => {
        // 直接加入訂閱channel
        subscribeChannel.map(item => {
          const roomName = 's' + item.id
          socket.join(roomName)
        })
      })

      // 取出user所有未讀取的通知
      Unread.findAll({
        where: { receiveId: { [Op.eq]: userId } },
        attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'unreadCount']]
      })
      .then(unreads => {
        socket.emit('notices', unreads)
      })

      // 當user觸發讀取通知
      socket.on('read-notice', async (userId) => {
        try {
          const unreads = await Unread.findAll({
            raw: true,
            where: { receiveId: { [Op.eq]: userId } }
          })

          socket.emit('read-notice', unreads)

          await Unread.destroy({
            where: { receiveId: { [Op.eq]: userId } }
          })
        }
        catch (err) {
          console.log(err)
        }
      })

      // 公開聊天室部分
      // 加入公開聊天室
      socket.on('join-public-room', async (userId) => {

        socket.join('public-room')

        publicRoomList.push(userId)

        // 取出在公開聊天室者資料
        try {
          const inRoomUsers = await User.findAll({
            where: { id: { [Op.in]: publicRoomList } },
            attributes: ['id', 'name', 'account', 'avatar']
          })

          const publicChatRecord = await PublicChat.findAll({
            include: { model: User, as: 'user', attributes: ['name', 'account', 'avatar'] }
          })

          // 公告使用者上線
          socket.broadcast
            .to('public-room')
            .emit('public-online-notice', userId)
  
          // 回傳線上人員列表及使用者列表
          io.to('public-room')
            .emit('online-list', inRoomUsers)

          socket.to(socket.id).emit('public-chat-record', publicChatRecord)
        }
        catch (err) {
          console.log(err)
        }

      })

      // 監聽公開聊天室訊息並廣播
      socket.on('public-msg', async ({ userId, message }) => {
        try {
          console.log("🚀 ~ file: server.js ~ line 120 ~ socket.on ~ message", message)
          PublicChat.create({
            speakerId: userId,
            chatContent: message
          })
        }
        catch (err) {
          console.log(err)
        }

        socket.broadcast
          .to('public-room')
          .emit('public-msg', { userId, message })
      })
      // 以上公開聊天室


      // 以下私人聊天室

      // 監聽並建立房間
      socket.on('join-room', async ({ roomId }) => {
        try {
          const chatRecord = await ChatRecord.findAll({
            where: { roomId: { [Op.eq]: roomId } }
          })

          io.to(roomId).emit('room-info', { roomId, targetId, chatRecord })
        }
        catch (err) {
          console.log(err)
        }
      })

      //建立通話 使用broadcast不會傳送給發訊者
      socket.on('chatMessage', (data) => {
        const roomId = data.roomId
        const message = data.msg
        const userId = data.userId.toString()

        // 寫進資料庫
        ChatRecord.create({
          roomId: roomId,
          speakerId: userId,
          chatContent: message
        })

        socket.broadcast
        .to(roomId)
        .emit('chatMessage', { message, roomId })
      })

      socket.on('disconnect', () => {
        const socketId = socket.id
        const userId = onlineIdList.filter(item => onlineList[item].id === socketId)[0]
        const userIdIndex = onlineIdList.indexOf(userId)
        onlineIdList.splice(userIdIndex, 1)
        delete onlineList[userId]
        socket.broadcast
          .to('public-room')
          .emit('public-offline-notice', userId)
        
        userChatrooms.map(item => {
          socket.broadcast
            .to(item)
            .emit('chat-offline-notice', userId)
        })
      })
    })
  })
}

module.exports = socketConnection