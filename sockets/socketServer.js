const db = require('../models')
const Chat = db.Chat
const User = db.User
const UnreadChat = db.UnreadChat
const { userIndex, authenticated, formatMessage, historyMsg } = require('./utils')
const moment = require('moment')
moment.locale('zh_TW')

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
    const chatRecords = await historyMsg('publicRoom', Chat)
    io.to('publicRoom').emit('historyMsg', chatRecords)
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
        receivedUserId: 0,
        message: msg,
        time: moment().format('h:mm a'),
        channel: socket.user.channel
      })
      const msgData = {
        ChatId: chat.id,
        UserId: chat.UserId,
        receivedUserId: chat.receivedUserId,
        username: socket.user.name,
        avatar: socket.user.avatar,
        text: msg,
        time: chat.time,
        msgType: ''
      }
      // 發送訊息資訊給前端
      if (socket.user.channel === 'publicRoom') {
        io.to('publicRoom').emit('chatMsg', msgData)
      }
    })

    // listen for privateUser
    socket.on('privateUser', async (userId) => {
      // 找出 user
      const user = await User.findOne({ where: { id: userId } })
      if (user) {
        // 告訴前端 user存在
        socket.emit('findUser', `userId: ${userId} has been found~`)
        // 建立房間
        const userList = []
        userList.push(user.id, socket.user.id)
        userList.sort()
        const roomName = userList.join('-')
        // 更換使用者頻道
        socket.user.channel = roomName
        // 切換房間
        socket.join(roomName)
        // 找出歷史訊息，發送給前端
        const chatRecords = await historyMsg(socket.user.channel, Chat)
        socket.emit('historyMsg', chatRecords)
        // listen for userMsg
        socket.on('userMsg', async (msg) => {
          // 找出 receivedUserId
          const userList = socket.user.channel.split('-')
          const receivedUserId = userList.find(userId => Number(userId) !== socket.user.id)
          // 存到資料庫
          const chat = await Chat.create({
            UserId: socket.user.id,
            receivedUserId,
            message: msg,
            time: moment().format('h:mm a'),
            channel: socket.user.channel
          })
          const msgData = {
            ChatId: chat.id,
            UserId: chat.UserId,
            receivedUserId: chat.receivedUserId,
            username: socket.user.name,
            avatar: socket.user.avatar,
            text: msg,
            time: chat.time,
            msgType: ''
          }
          // 發送訊息資訊給前端
          io.to(socket.user.channel).emit('chatMsg', msgData)
          // 未讀訊息存入 UnreadChat
          await UnreadChat.create({
            ChatId: chat.id,
            UserId: receivedUserId
          })
        })
      } else {
        // 告訴前端 user 不存在
        socket.emit('findUser', `can not find userId: ${userId}!`)
      }
    })

    // 列出私人歷史訊息
    const allHistoryChannel = await Chat.findAll({
      raw: true,
      nest: true,
      where: { receivedUserId: socket.user.id },
      attributes: ['channel']
    })
    const channelArr = []
    allHistoryChannel.forEach(channel => {
      if (!channelArr.includes(channel.channel)) {
        channelArr.push(channel.channel)
      }
    })
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
      chat = {
        id: chat.id,
        UserId: chat.UserId,
        receivedUserId: chat.receivedUserId,
        text: chat.message,
        time: chat.time,
        channel: chat.channel,
        username: chat.User.name,
        account: chat.User.account,
        avatar: chat.User.avatar
      }
      historyMsgForOneUser.push(chat)
    }
    socket.emit('historyMsgForOneUser', historyMsgForOneUser)

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
