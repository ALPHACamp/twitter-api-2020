const jwt = require('jsonwebtoken')
const { User, Chat, ChatRead, sequelize } = require('../models')
const { authenticated, formatMessage, userLeave } = require('./utils/user')

module.exports = (io) => {

  // 驗證身分
  io.use(authenticated)
  //擺上來，不然每次都會重製
  let onlineCount = 0
  let userList = []

  io.on('connection', socket => {
    console.log("有人進來了")
    // 計算上線人數

    onlineCount++;
    console.log("人數:", onlineCount)
    io.emit("online", onlineCount)

    // 取出登入使用者
    const user = socket.user
    console.log("使用者資訊", user)

    // 未點擊頭像前使用者進入 channel 都是強制切換 'publicRoom'
    user.channel = 'publicRoom'

    // 進入頻道
    socket.join(user.channel)

    // 發送該頻道歷史訊息
    historicalRecord(user.channel)
    // 回傳使用者資訊 渲染前端
    io.emit("onlineUser", user)


    // 儲存目前上線使用者

    userList.push(user)
    // console.log("userList", userList)
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
      // console.log("sent", msg)
      if (Object.keys(msg).length < 0) return
      try {
        await Chat.create({
          UserId: user.id,
          message: msg.msg,
          channel: user.channel,
          avatar: msg.avatar,
          // read: "0"
        }).then(usermsg => {
          const data = {
            ...usermsg.dataValues,
            messageId: usermsg.id
          }
          io.to(user.channel).emit("message", { ...data, ...user })
        })

      } catch (e) {
        console.log(e)
      }
    })



    socket.on("messageRead", async (data) => {
      try {
        // console.log("read", data)
        let reviseRepeat = await ChatRead.findAll({ where: { chatId: data.id, UserId: user.id } })
        // console.log(reviseRepeat)
        if (reviseRepeat.length === 0) {
          await ChatRead.create({
            UserId: user.id,
            ChatID: data.id
          })
        } else {

        }
      } catch (e) {
        console.log(e)
      }

    })

    async function historicalRecord(channelData) {
      //發送歷史紀錄
      // let readMessage = await Chat.findAll({
      //   where: { channel: channelData },
      //   include: { model: ChatRead, where: { UserId: user.id.toString() } },
      //   order: [
      //     // 資料庫端進行排列
      //     [sequelize.literal('createdAt'), 'ASC']
      //   ],
      //   attributes: {
      //     // 過濾不要資料
      //     exclude: ['updatedAt']
      //   },
      //   raw: true,
      //   nest: true,
      // })

      let Message = await Chat.findAll({
        where: { channel: channelData },
        include: { model: ChatRead, },
        order: [
          // 資料庫端進行排列
          [sequelize.literal('createdAt'), 'ASC']
        ],
        attributes: {
          // 過濾不要資料
          exclude: ['updatedAt']
        },
        // raw: true,
        // nest: true,
      })

      // console.log(Message)
      // let readMessage = userMessage.filter(item => item.ChatReads.UserId === user.id.toString())
      let readMessage = []
      let unreadMessage = []
      Message.map(item => {
        let findRead = item.dataValues.ChatReads.filter(read => {
          if (read.dataValues.UserId === user.id.toString()) {
            return true
          }
        })
        if (findRead.length > 0) {
          // console.log(item.dataValues)
          readMessage.push(item.dataValues)
        } else {
          unreadMessage.push(item.dataValues)
        }

      })
      // console.log(item.ChatReads.filter(ChatRead => ChatRead.UserId === user.id.toString())
      // )

      // }
      // )
      // let unreadMessage = Message.filter(item => item.ChatReads.UserId === null)
      // console.log(readMessage)
      // console.log(unreadMessage)


      let unreadNotify = unreadMessage.length
      console.log("read", readMessage)
      console.log("unread", unreadNotify)


      io.to(user.channel).emit('chatRecord', { readMessage, unreadMessage })
      // socket.to(user.channel).emit('chatRecord', readMessage);
    }

    // 離線
    socket.on('disconnect', () => {
      onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1

      // 帶入 userLeave() 判斷誰離開
      const userLeft = userLeave(user.socketId, userList);
      console.log("有人離開了", user.name)

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