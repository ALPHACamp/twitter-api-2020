const jwt = require('jsonwebtoken')
const { User, Chatpublic, ChatPrivate, sequelize } = require('../models')
const chatPrivate = require('../models/chatPrivate')


// 驗證身分
async function authenticated(socket, next) {
  console.log(socket.handshake)
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
    user.channel = 'publicRoom'

    // 回傳使用者資訊 渲染前端
    io.emit("onlineUser", user)

    // 儲存目前上線使用者
    let userList = []
    userList.push(user)

    socket.on("get-private-chat", (data) => {
      let userList = []
      userList.push(user.id.toString(), data.userId.toString())
      userList.sort()
      roomName = userList.join("plus")

      socket.join(roomName)
      io.sockets.to(roomName).emit('message', `${user.name} has join this room`);
      historicalRecord()

    })

    // 分配聊天室 先驗證
    // console.log(socket.handshake.query)
    let roomName = socket.handshake.query.channel
    if (roomName !== 'publicRoom') {
      // 將兩位使用者帶入 特定Room
      socket.join(roomName)
    }
    // 將使用者帶入公開聊天Room
    // socket.join(roomName)

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

    // let privateChatRecord = chatPrivate.findAll({ where: channelId })

    // 監聽使用者送出訊息 送出 'message' 
    socket.on("send", async (msg) => {
      // 如果 msg 內容鍵值小於 2 等於是訊息傳送不完全
      // 因此我們直接 return ，終止函式執行。
      // console.log(msg)
      if (Object.keys(msg).length < 2) return;
      try {
        console.log(roomName)
        if (roomName) {
          await ChatPrivate.create({
            UserId: msg.id,
            message: msg.msg,
            time: msg.time,
            channelId: roomName
          }).then(user => {
            const data = {
              UserId: user.dataValues.UserId,
              msg: user.dataValues.message,
              roomName
            }
            io.emit("message", data)
          })
        } else {
          await Chatpublic.create({
            UserId: msg.id,
            message: msg.msg,
            time: msg.time
          }).then(user => {
            const data = {
              UserId: user.dataValues.UserId,
              msg: user.dataValues.message,
            }
            io.emit("message", data)

          })
        }
      } catch (e) {
        console.log(e)
      }

    })

    function historicalRecord() {

      // 發送歷史紀錄
      ChatPrivate.findAll({
        where: { ChannelId: roomName },
        // attributes: ['msg', 'time'],
        order: [
          // 資料庫端進行排列
          [sequelize.literal('createdAt'), 'ASC']
        ],
        raw: true,
        nest: true,
      }).then(userMessage => {

        socket.emit("chatRecordPrivate", userMessage)
      })
    }

    // 離線
    socket.on('disconnect', () => {
      onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1
      io.emit("online", onlineCount)
    })
  })

}