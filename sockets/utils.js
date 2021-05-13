const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

// dayjs
const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const User = require('../models').User
const Chat = require('../models').Chat

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
    // time: moment.utc().locale('zh_TW').utcOffset('+08:00').format('h:mm a'),
    time: dayjs().tz('Asia/Taipei').format('h:mm a'),
    msgType
  }
}

async function historyMsg (channel) {
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
  }
}

function getPublicUsers (users) {
  return users.filter(user => user.channel === 'publicRoom')
}

async function historyMsgForOneUser (id) {
  try {
    // 列出私人歷史訊息
    const allHistoryChat = await Chat.findAll({
      raw: true,
      nest: true,
      where: { [Op.or]: [{ UserId: id }, { receivedUserId: id }] },
      attributes: ['channel']
    })
    const channelArr = []
    allHistoryChat.forEach(chat => {
      if (chat.channel !== 'publicRoom') {
        if (!channelArr.includes(chat.channel)) {
          channelArr.push(chat.channel)
        }
      }
    })
    // 把時間倒過來排
    channelArr.reverse()
    const historyMsgForOneUser = []
    for (let i = 0; i < channelArr.length; i++) {
      let chat = await Chat.findAll({
        raw: true,
        nest: true,
        where: { channel: channelArr[i] },
        order: [['createdAt', 'DESC']],
        limit: 1,
        include: [User]
      })
      chat = chat[0]
      // 找到非本人的資料
      const Id = chat.UserId === id ? chat.receivedUserId : chat.UserId
      const user = await User.findByPk(Id)
      // 重整資料
      chat = {
        id: chat.id,
        UserId: chat.UserId,
        receivedUserId: chat.receivedUserId,
        text: chat.message,
        time: chat.time,
        channel: chat.channel,
        username: user.name,
        account: user.account,
        avatar: user.avatar
      }
      historyMsgForOneUser.push(chat)
    }
    return historyMsgForOneUser
  } catch (e) {
    console.log(e)
  }
}

async function getUnreadMsg (id) {
  try {
    const msg = await Chat.findAll({
      raw: true,
      nest: true,
      where: { receivedUserId: id, isRead: false },
      attributes: ['id', 'UserId', 'receivedUserId', 'channel', 'time']
    })
    return msg
  } catch (e) {
    console.log(e)
  }
}

module.exports = { authenticated, userIndex, formatMessage, historyMsg, getPublicUsers, historyMsgForOneUser, getUnreadMsg }
