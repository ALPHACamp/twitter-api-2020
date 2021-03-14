const jwt = require('jsonwebtoken')
const { User, Chat, sequelize } = require('../models')
const { authenticated, formatMessage, userLeave } = require('./utils/user')

module.exports = (io) => {

  // 驗證身分
  // io.use(authenticated)
  //擺上來，不然每次都會重製
  let onlineCount = 0

  io.on('connection', socket => {
    // console.log('已連線')
    console.log("有人進來了")
    // 計算上線人數

    onlineCount++;
    console.log("人數:", onlineCount)
    io.emit("online", onlineCount)

    // 取出登入使用者
    // const user = socket.user
    const user = {
      id: 1,
      name: 'user1',
      account: 'Jhon Doe',
      email: 'user1@example.com',
      avatar: 'https://i.imgur.com/lPqM3om.jpg',
      isAdmin: 0,
      socketId: 'Pwv-005DMkPb7sN2AAAL',
      channel: 'publicRoom'
    }


    // 未點擊頭像前使用者進入 channel 都是強制切換 'publicRoom'
    user.channel = 'publicRoom'

    // 進入頻道
    socket.join(user.channel)

    // 發送該頻道歷史訊息
    historicalRecord(user.channel)
    console.log(user)
    // 回傳使用者資訊 渲染前端
    io.emit("onlineUser", user)


    // 儲存目前上線使用者
    let userList = []
    userList.push(user)
    io.emit("allOnlineUsers", userList)


    socket.on("get-private-chat", (data) => {
      let userList = []
      // 編輯房號
      userList.push(user.id.toString(), data.userId.toString())
      userList.sort()
      // 建立房間
      roomName = userList.join("plus")
      // 更換使用者頻道
      user.channel = roomName
      // 切換房間
      socket.join(user.channel)
      // io.sockets.to(roomName).emit('message', `${user.name} has join this room`);
      historicalRecord(user.channel)
    })


    const botName = 'ChatCord Bot'
    socket.broadcast.to(user.roomName).emit(
      'message',
      formatMessage(botName, `${user.name} 加入了聊天`)
    )


    // 監聽使用者送出訊息 送出 'message' 
    socket.on("send", async (msg) => {
      console.log(msg)
      if (Object.keys(msg).length < 0) return
      try {
        if (user.channel !== 'publicRoom') {
          await Chat.create({
            UserId: msg.id,
            message: msg.msg,
            channel: user.channel,
            avatar: msg.avatar
          }).then(usermsg => {
            const data = {
              ...usermsg.dataValues,
              messageId: usermsg.id
            }
            io.emit("message", { ...data, ...user })
          })
        } else {
          await Chat.create({
            UserId: msg.id,
            message: msg.msg,
            channel: user.channel
          }).then(usermsg => {
            const data = {
              ...usermsg.dataValues,
              messageId: usermsg.id
            }
            io.emit("message", { ...data, ...user })
          })
        }
      } catch (e) {
        console.log(e)
      }
    })

    function historicalRecord(channelData) {
      // 發送歷史紀錄
      Chat.findAll({
        where: { channel: channelData },
        order: [
          // 資料庫端進行排列
          [sequelize.literal('createdAt'), 'ASC']
        ],
        attributes: {
          // 過濾不要資料
          exclude: ['updatedAt']
        },
        raw: true,
        nest: true,
      }).then(userMessage => {
        // console.log('========歷史訊息', userMessage)
        // return userMessage
        if (user.channel === 'publicRoom') {
          // socket.broadcast.to(user.channel).emit("chatRecord", userMessage)
          // socket.to(user.channel).emit("chatRecord", userMessage)
          // socket.emit("chatRecord", userMessage)
          io.to(user.channel).emit('chatRecord', userMessage)

        } else {
          io.to(user.channel).emit('chatRecord', userMessage)
          // socket.broadcast.to(user.channel).emit("chatRecord", userMessage)
          // socket.emit("chatRecord", userMessage)
        }
      })
    }

    // 離線
    socket.on('disconnect', () => {
      onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1

      // 帶入 userLeave() 判斷誰離開
      const userLeft = userLeave(user.socketid, userList);
      console.log("有人離開了")
      // 向該頻道通知誰離開
      if (userLeft) {
        io.emit("offlineUser", userLeft)
        io.to(userLeft.room).emit(
          'message',
          formatMessage(botName, `${userLeft.name} has left the chat`)
        )
      }
      io.emit("online", onlineCount)
    })
  })

}