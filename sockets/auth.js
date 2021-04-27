const jwt = require('jsonwebtoken')
const User = require('../models').User
// let userList = []

// 驗證身分
async function authenticated (socket, next) {
  try {
    // 取出 token
    console.log('socket.handshake.auth', socket.handshake.auth)
    const token = socket.handshake.auth.token
    console.log('token', token)
    // 驗證使用者
    if (!token) return
    // 驗證 token 並取出 id
    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    console.log('id', id)
    // 找出該使用者資訊
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'account', 'email', 'avatar', 'role']
    })
    // 存進 socket
    if (user) {
      socket.user = user
      socket.user.socketId = socket.id
      socket.user.channel = 'publicRoom'
      next()
    }
  } catch (e) {
    console.log(e)
    return next()
  }
}



module.exports = authenticated
