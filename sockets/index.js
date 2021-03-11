const jwt = require('jsonwebtoken')
const passport = require('../config/passport')
const { User, Message, sequelize } = require('../models')

module.exports = (io) => {
  // 計算上線人數
  let onlineCount = 0
  io.on('connection', async (socket) => {
    console.log('user connection')
    console.log('======================', socket.id)

    // 取出 token
    const token = socket.handshake.auth.token
    // 驗證使用者
    if (!token) return
    // 驗證 token 並取出 id
    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    // 找出該使用者資訊
    const user = await User.findByPk(id , {
      attributes: ['id', 'name', 'account', 'email', 'avatar', "isAdmin"],
      raw: true,
      nest: true
    })
    // 回傳使用者資訊 渲染前端
    io.emit("userData", user)

    console.log('=========使用者=============', user)


      // 發送連線人數給網頁
      onlineCount++;
    io.emit("online", onlineCount)

    // 發送歷史紀錄
    await Message.findAll({
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
    // 監聽登入資料
    socket.on('login', userData => {
      console.log('======userData', userData)
    })

    // 監聽
    socket.on("send", async (msg) => {
      console.log('監聽前端使用者訊息', msg)
      // 如果 msg 內容鍵值小於 2 等於是訊息傳送不完全
      // 因此我們直接 return ，終止函式執行。
      if (Object.keys(msg).length < 2) return;

      await Message.create({
        UserId: '1',
        msg: msg.msg,
        time: msg.time
      }).then(user => {
        const data = {
          time: user.dataValues.time,
          name: user.dataValues.name,
          msg: user.dataValues.msg
        }
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