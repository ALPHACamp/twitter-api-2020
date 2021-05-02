const db = require('../models')
const Chat = db.Chat
const User = db.User
const UnreadChat = db.UnreadChat
const { userIndex, authenticated, formatMessage, historyMsg } = require('./utils')
const moment = require('moment')

const users = []
const botName = 'Chat Bot'
const connectionCount = {}

module.exports = (io) => {
  // 驗證身分
  io.use(authenticated)

  // run when connect
  io.on('connection', async (socket) => {
    // 加入房間 (預設進入 publicRoom)
    socket.join(socket.user.channel)
    // 發送 user 資訊給前端
    socket.emit('userInfo', socket.user)
    // 找出歷史訊息，發送給前端
    const chatRecords = await historyMsg(socket.user.channel, Chat)
    socket.emit('historyMsg', chatRecords)
    // 若使用者第一次進來聊天室，則加入 users，並傳送系統歡迎訊息
    if (userIndex(users, socket.user.id) === -1) {
      // put userInfo to users
      users.push(socket.user)
      // 計算單一 user connection 次數
      connectionCount[socket.user.id] = 1
      if (socket.user.channel === 'publicRoom') {
        // 加入聊天室訊息
        socket.to(socket.user.channel).emit('userOnline', formatMessage(botName, `${socket.user.name} has joined the chat`, 'userOnline'))
      }
    } else {
      // 計算單一 user connection 次數
      connectionCount[socket.user.id] ++
    }

    // online count
    io.to(socket.user.channel).emit('onlineCount', users.length)

    // user list
    io.to(socket.user.channel).emit('userList', users)

    // listen for userMsg
    socket.on('userMsg', async (msg) => {
      // 存到資料庫
      const chat = await Chat.create({
        UserId: socket.user.id,
        message: msg,
        time: moment().format('h:mm a'),
        channel: socket.user.channel
      })
      const msgData = {
        ChatId: chat.id,
        UserId: chat.UserId,
        username: socket.user.name,
        avatar: socket.user.avatar,
        text: msg,
        time: chat.time,
        msgType: ''
      }
      // 發送訊息資訊給前端
      io.to(socket.user.channel).emit('chatMsg', msgData)
      // 判斷使用者私訊的人在不在線，不在的話就把訊息存入 UnreadChat
      if (socket.user.channel !== 'publicRoom') {
        const userList = socket.user.channel.split('-')
        const userName = userList.find(user => user !== socket.user.name)
        const userOnline = users.findIndex(user => user.name === userName)
        if (userOnline === -1) {
          // 未讀訊息存入 UnreadChat
          const user = await User.findOne({ where: { name: userName } })
          const chat = await Chat.findOne({ where: { message: msgData.text, time: msgData.time } })
          await UnreadChat.create({
            ChatId: chat.id,
            UserId: user.id
          })
        }
      }
    })

    // listen for privateUser
    socket.on('privateUser', async (username) => {
      // 找出 user
      const user = await User.findOne({ where: { name: username }})
      if (user) {
        // 告訴前端 user存在
        socket.emit('findUser', `user: ${username} has been found~`)
        // 建立房間
        const userList = []
        userList.push(username, socket.user.name)
        userList.sort()
        const roomName = userList.join('-')
        // 更換使用者頻道
        socket.user.channel = roomName
        // 切換房間
        socket.join(roomName)
        // 找出歷史訊息，發送給前端
        const chatRecords = await historyMsg(socket.user.channel, Chat)
        socket.emit('historyMsg', chatRecords)
      } else {
        // 告訴前端 user 不存在
        socket.emit('findUser', `can not find user: ${username}!`)
      }
    })

    // 列出私人歷史訊息
    // const allHistoryMsg = await Chat.findAll({ where: { UserId: socket.user.id }})
    // allHistoryMsg
    // socket.emit('')

    // 是否有未讀訊息
    const msg = await UnreadChat.findAll({
      raw: true,
      nest: true,
      where: { UserId: socket.user.id },
      attributes: ['id', 'UserId', 'ChatId']
    })
    if (msg.length > 0) {
      socket.emit('unreadMsg', msg)
    }
    // 刪掉已讀訊息
    socket.on('readMsg', msgs => {
      msgs.forEach(async msg => {
        await UnreadChat.destroy({ where: { id: msg.id } })
      })
    })

    // run when client disconnect
    socket.on('disconnect', () => {
      // 計算單一 user connection 次數
      connectionCount[socket.user.id] --
      if (connectionCount[socket.user.id] === 0) {
        // take userInfo to users
        users.splice(userIndex(users, socket.user.id), 1)
        // 離開聊天室訊息
        if (socket.user.channel === 'publicRoom') {
          io.to(socket.user.channel).emit('userOffline', formatMessage(botName, `${socket.user.name} has left the chat`, 'userOffline'))
        }
      }

      // online count
      io.emit('onlineCount', users.length)

      // user list
      io.emit('userList', users)
    })
  })
}
