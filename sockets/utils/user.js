const jwt = require('jsonwebtoken')
const { User, Chat, sequelize } = require('../../models')
let userList = []

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
    socket.user.channel = 'publicRoom'
    next()
  }
}


// 獲取現在上線所有用戶
function getRoomUsers(room) {
  return userList.filter(user => user.channel.length > 0)
}

//獲取當前用戶
function getCurrentUser(id) {
  return userList.find(user => user.socketId === id)
}

//加入用戶聊天
function userJoin(chatUser, socket) {
  userList.push(chatUser)
  // 進入頻道
  socket.join(chatUser.channel)
  return userList
}

// 用戶離開聊天
function userLeave(id) {
  const index = userList.findIndex(user => user.socketId === id)

  if (index !== -1) {
    return userList.splice(index, 1)[0]
  }
}

// 取出 disconnect 後現在 userList 名單
function allOnlineUsersNow() {
  return userList
}

//針對特定房間用戶連接時廣播
function formatMessage(username, text) {
  return {
    username,
    text,
  }
}



module.exports = {
  authenticated,
  formatMessage,
  userLeave,
  getRoomUsers,
  userJoin,
  getCurrentUser,
  allOnlineUsersNow
}