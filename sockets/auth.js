const jwt = require('jsonwebtoken')
const User = require('../models').User
// let userList = []

// 驗證身分
async function authenticated (socket, next) {
  try {
    // 取出 token
    const token = socket.handshake.auth.token
    // 驗證使用者
    if (!token) return
    // 驗證 token 並取出 id
    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    // 找出該使用者資訊
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'account', 'email', 'avatar', 'role']
    })
    // 存進 socket
    if (user) {
      socket.user = user
      socket.user.socketId = socket.id
      // socket.user.channel = 'publicRoom'
      console.log('put user into socket : success')
      next()
    }
  } catch (e) {
    console.log(e)
    return next(e)
  }
}

module.exports = authenticated
