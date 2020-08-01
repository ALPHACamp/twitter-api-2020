const chatSocket = require('./chat.js')
const notification = require('./notification.js')

const jwt = require('jsonwebtoken')

module.exports = (io) => {

  const onlineUsers = [] // 存放在線使用者資訊：{userId: xx, socketId: yy}

  io.use((socket, next) => {
    // 檢查有無帶 token
    if (!socket.handshake.query.token) return

    // 驗證 token
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err)
        return
      }

      // 加入使用者列表
      onlineUsers.push({ userId: decoded.id, socketId: socket.id })
      next()
    })
  })

  io.on('connect', (socket) => {
    console.log(`新增一個使用者連線 with socket id ${socket.id}`)

    // 使用 chatSocket 功能 (sockets/chat.js)
    chatSocket(io, socket, onlineUsers)
  })
}
