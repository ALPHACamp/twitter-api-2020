const jwt = require('jsonwebtoken')
const passport = require('../config/passport')
const { User, Message, sequelize } = require('../models')

// 驗證身分
async function authenticated(socket, next) {
  // console.log('====ID======', JSON.parse(JSON.stringify(socket.handshake)))
  // console.log('====channel======', JSON.parse(JSON.stringify(socket.handshake.query.channel)))
  // 取出 token
  const token = socket.handshake.auth.token
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

// 歷史訊息分類 私聊 & 公聊
function historicalRecord() {

  // 發送歷史紀錄
  Message.findAll({
    // attributes: ['msg', 'time'],
    order: [
      // 資料庫端進行排列
      [sequelize.literal('createdAt'), 'ASC']
    ],
    raw: true,
    nest: true,
  }).then(userMessage => {
    socket.emit("chatRecord", userMessage)
  })
}


module.exports = (io) => {
  // 驗證身分
  io.use(authenticated)
  // 開始連線
  io.on('connection', async (socket) => {
    // console.log('=======', socket.handshake.query.channel)
    let roomName = socket.handshake.query.channel
    console.log('==roomName==', roomName)
    if (roomName !== 'publicRoom') {
      console.log('==所以是私人房間==')
      // socket.join(publicRoom)
    }
    
    console.log('====是公開聊===')
    // socket.join(privateRoom)

    // 計算上線人數
    let onlineCount = 0
    // 取出登入使用者
    const user = socket.user
    // 儲存目前上線使用者
    let userList = []
    userList.push(user)

    console.log('user connection')
    // 轉換型態 建立房間名 ? user.id.toString()
    // console.log('=========誰進入===============', typeof(user.id.toString()))


    // 回傳使用者資訊 渲染前端
    io.emit("onlineUser", user)

    // 發送連線人數給網頁
    onlineCount++;
    io.emit("online", onlineCount)

    // 監聽登入資料
    socket.on('login', userData => {
      // console.log('======userData', userData)
    })

    // 監聽使用者進入私聊 // 聊天對象的 id & name
    socket.on('get-private-chat', ({ userId, userName }) => {
      // 建立房間名
      const roomName = []
      // 建立私聊房間編號
      roomName.push(userId.toString(), user.id.toString())
      roomName.sort()
      const privateRoom = roomName[0] + roomName[1]

      // 將登入使用者加入 privateRoom
      user.privateRoom = privateRoom

      // 建立私聊 我 & 他 資訊陣列
      const users = [];
      const userJoinData = userJoin(Number(userId), userName, Number(privateRoom))

      // 私聊對象資料
      function userJoin(userId, userName, privateRoom) {
        const userPrivate = { userId, userName, privateRoom }
        return userPrivate;
      }

      users.push(user);
      users.push(userJoinData);
      console.log('====加入用戶聊天====', users)

      // 將使用者分配到此房間 // 只有選擇該房間使用者聊天訊息可被看到
      socket.join(privateRoom)

      // // Welcome current user
      // const botName = 'ChatCord Bot'
      // socket.emit('msg', formatMessage(botName, 'Welcome to ChatCord!'))

      // //針對特定房間用戶連接時廣播
      // socket.broadcast.to(privateRoom).emit("msg", )
        

      // // 發送用戶和房間信息
      // io.to(user.room).emit('roomUsers', {
      //   room: user.room,
      //   users: getRoomUsers(user.room)
      // });
    })

    // 監聽使用者送出訊息
    socket.on("send", async (msg) => {
      console.log('監聽前端使用者訊息', msg)
      // 如果 msg 內容鍵值小於 2 等於是訊息傳送不完全
      // 因此我們直接 return ，終止函式執行。
      if (Object.keys(msg).length < 2) return;

      await Message.create({
        UserId: msg.id,
        msg: msg.msg,
        time: msg.time
      }).then(user => {
        const data = {
          name: user.dataValues.name,
          msg: user.dataValues.msg
        }
        console.log('========="send"======', user);
        io.emit("msg", data)
      })
    })

    // 離線
    socket.on('disconnect', () => {
      onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1
      io.emit("online", onlineCount)
    })

  })
}