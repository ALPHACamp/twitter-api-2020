const jwt = require('jsonwebtoken')
const moment = require('moment')
moment.locale('zh_TW')
const User = require('../models').User

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
      socket.user.channel = 'publicRoom'
      next()
    }
  } catch (e) {
    console.log(e)
    return next(e)
  }
}

function userIndex (users, userId) {
  const index = users.findIndex(user => user.id === userId)
  return index
}

function formatMessage (username, text, msgType) {
  return {
    username,
    text,
    // time: moment().format('h:mm a'),
    time: moment.utc().locale('zh_TW').utcOffset('+08:00').format('h:mm a'),
    msgType
  }
}

async function historyMsg (channel, Chat, next) {
  try {
    let chatRecords = await Chat.findAll({
      raw: true,
      nest: true,
      include: [User],
      where: { channel }
    })
    chatRecords = chatRecords.map(record => ({
      id: record.id,
      text: record.message,
      time: record.time,
      UserId: record.UserId,
      username: record.User.name,
      avatar: record.User.avatar
    }))
    return chatRecords
  } catch (e) {
    console.log(e)
    return next()
  }
}

function getPublicUsers (users) {
  return users.filter(user => user.channel === 'publicRoom')
}

module.exports = { authenticated, userIndex, formatMessage, historyMsg, getPublicUsers }
