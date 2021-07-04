const { Chat, User, ChatRead, sequelize } = require('../models')
const {
  authenticated,
  formatMessage,
  userLeave,
  getRoomUsers,
  getCurrentUser,
  userJoin,
  allOnlineUsersNow,
  filterData
} = require('./utils/user')


module.exports = (io) => {

  // 驗證身分
  io.use(authenticated)
  //擺上來，不然每次都會重製
  let onlineCount = 0

  io.on('connection', socket => {

    // 計算上線人數
    onlineCount++

    userJoin(socket.user, socket)
    const getUser = getCurrentUser(socket.id)
    const getUsers = getRoomUsers(socket.user)
    const botName = 'ChatCord Bot'

    // 公共聊天歷史訊息回傳
    historicalRecord(getUser.channel)

    // 回報上線人數
    io.emit("online", onlineCount)

    // 回傳使用者資訊 渲染前端
    io.emit("onlineUser", getUser)

    // 所有上線使用者資訊
    io.emit("allOnlineUsers", filterData(getUsers))

    // 廣播誰上線
    socket.broadcast.to(getUser.channel).emit(
      'message',
      formatMessage(botName, `${getUser.name} 加入了聊天`)
    )

    // 處理私人訊息
    socket.on("get-private-chat", (data) => {
      let userList = []
      // 編輯房號
      userList.push(getUser.id.toString(), data.userId.toString())
      userList.sort()
      // 建立房間
      roomName = userList.join("plus")
      // 更換使用者頻道
      getUser.channel = roomName
      // 切換房間
      socket.join(getUser.channel)
      // io.sockets.to(roomName).emit('message', `${user.name} has join this room`)
      historicalRecord(getUser.channel)
    })


    // 監聽使用者送出訊息 送出 'message' 
    socket.on("send", async (msg) => {
      if (Object.keys(msg).length < 0) return
      try {
        await Chat.create({
          UserId: getUser.id,
          message: msg.msg,
          channel: getUser.channel,
          avatar: msg.avatar
        }).then(userMsg => {
          const data = {
            ...userMsg.dataValues,
            messageId: userMsg.id
          }
          io.to(getUser.channel).emit("message", { ...data, ...getUser })
        })
      } catch (e) {
        console.log(e)
      }
    })

    // 未讀訊息
    socket.on("messageRead", async (data) => {
      try {
        let reviseRepeat = await ChatRead.findAll({ where: { chatId: data.id, UserId: getUser.id } })
        if (reviseRepeat.length === 0) {
          await ChatRead.create({
            UserId: getUser.id,
            ChatID: data.id
          })
        } else {

        }
      } catch (e) {
        console.log(e)
      }

    })

    async function historicalRecord(channelData) {
      let Message = await Chat.findAll({
        where: { channel: channelData },
        include: { model: ChatRead },
        order: [
          // 資料庫端進行排列
          [sequelize.literal('createdAt'), 'ASC']
        ],
        attributes: {
          // 過濾不要資料
          exclude: ['updatedAt']
        }
      })
      let readMessage = []
      let unreadMessage = []
      Message.map(item => {
        let findRead = item.dataValues.ChatReads.filter(read => {
          if (read.dataValues.UserId === getUser.id.toString()) {
            return true
          }
        })

        if (findRead.length > 0) {
          readMessage.push(item.dataValues)
        } else {
          unreadMessage.push(item.dataValues)
        }
      })
      io.to(getUser.channel).emit('chatRecord', { readMessage, unreadMessage })
    }

    // 處理離線
    socket.on('disconnect', () => {
      onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1
      // 帶入 userLeave() 判斷誰離開
      const userLeft = userLeave(getUser.socketId)
      // 向該頻道通知誰離開
      if (userLeft) {
        const list = allOnlineUsersNow()
        io.emit("allOnlineUsers", list)
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