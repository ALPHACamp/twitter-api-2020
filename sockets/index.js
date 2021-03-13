const jwt = require('jsonwebtoken')
const { User, Chat, sequelize } = require('../models')

// 驗證身分
async function authenticated(socket, next) {

  // 取出 token
  const token = socket.handshake.auth.token
  // console.log('token', token)
  // 驗證使用者
  if (!token) return
  // 驗證 token 並取出 id
  const { id } = jwt.verify(token, process.env.JWT_SECRET)
  // 找出該使用者資訊
  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'account', 'email', 'avatar', "isAdmin"],
    raw: true,
    nest: true
  })
  // 存進 socket
  if (user) {
    socket.user = user
    socket.user.socketId = socket.id
    next()
  }
}


module.exports = (io) => {
  console.log('已連線')
  // 驗證身分
  io.use(authenticated)

  io.on('connection', socket => {

    // 計算上線人數
    let onlineCount = 0
    onlineCount++;
    io.emit("online", onlineCount)

    // 取出登入使用者
    const user = socket.user

    // 未點擊頭像前使用者進入 channel 都是強制切換 'publicRoom'
    user.channel = 'publicRoom'
    historicalRecord(user.channel)
    socket.join(user.channel)

    // 回傳使用者資訊 渲染前端
    io.emit("onlineUser", user)

    // 儲存目前上線使用者
    let userList = []
    userList.push(user)

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
      io.sockets.to(roomName).emit('message', `${user.name} has join this room`);
      historicalRecord(user.channel)
    })


    //針對特定房間用戶連接時廣播
    function formatMessage(username, text) {
      return {
        username,
        text,
        // time: moment().format('h:mm a')
      };
    }
    const botName = 'ChatCord Bot'
    // console.log('===username', user)
    socket.broadcast.to(user.roomName).emit(
      'message',
      formatMessage(botName, `${user.name} 加入了聊天`)
    )


    // 監聽使用者送出訊息 送出 'message' 
    socket.on("send", async (msg) => {
      // 如果 msg 內容鍵值小於 2 等於是訊息傳送不完全
      // 因此我們直接 return ，終止函式執行。
      if (Object.keys(msg).length < 2) return
      try {
        if (user.channel !== 'publicRoom') {
          await Chat.create({
            UserId: msg.id,
            message: msg.msg,
            channel: user.channel
          }).then(usermsg => {
            const data = {
              UserId: usermsg.dataValues.UserId,
              msg: usermsg.dataValues.message,
              channel: user.channel
            }
            const msg = [data, user]
            io.emit("message", msg)
          })
        } else {
          await Chat.create({
            UserId: msg.id,
            message: msg.msg,
            channel: user.channel
          }).then(usermsg => {
            const data = {
              UserId: usermsg.dataValues.UserId,
              msg: usermsg.dataValues.message,
            }
            const msg = [data, user]
            io.emit("message", msg)

          })
        }
      } catch (e) {
        console.log(e)
      }

    })



    function historicalRecord(channelData) {
      // 發送歷史紀錄
      Chat.findAll({
        where: { Channel: channelData },
        // attributes: ['msg', 'time']
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
        socket.emit("chatRecordPrivate", userMessage)
      })
    }

    // 離線
    socket.on('disconnect', () => {
      onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1

      // 找出誰離開
      function userLeave(id) {
        const index = userList.findIndex(user => user.socketid === id)
        if (index !== -1) {
          return userList.splice(index, 1)[0];
        }
      }
      // 帶入 userLeave() 判斷
      const userLeft = userLeave(user.socketid);

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