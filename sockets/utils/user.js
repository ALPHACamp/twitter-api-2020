const jwt = require('jsonwebtoken')
const { User, Chat, sequelize } = require('../../models')


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

//針對特定房間用戶連接時廣播
function formatMessage(username, text) {
  return {
    username,
    text,
  }
}

// 找出誰離開
function userLeave(id, userList) {
  const index = userList.findIndex(user => user.socketid === id)
  if (index !== -1) {
    return userList.splice(index, 1)[0];
  }
}

module.exports = {
  authenticated,
  formatMessage,
  userLeave
}