const chatSocket = require('./chat.js')
const notification = require('./notification.js')

const jwt = require('jsonwebtoken')

module.exports = (io) => {

  const users = []
  // {userId: xx, socketId: yy}

  io.use((socket, next) => {
    // 驗證 token
    if (!socket.handshake.query.token) return

    // verify a token symmetric
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err)
        return
      }
      users.push({ userId: decoded.id, socketId: socket.id })
      next()
    })
  })

  io.on('connect', (socket) => {
    // 解析 token 的 user.id
    console.log('新增一個使用者連線')

    // 使用 chatSocket 功能 (sockets/chat.js)
    chatSocket(io, socket, users)
  })
}
