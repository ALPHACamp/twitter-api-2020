const db = require('../models')
const Chat = db.Chat
const User = db.User
const { userIndex, authenticated, formatMessage } = require('./utils')

const users = []
const botName = 'Chat Bot'

module.exports = (io) => {
  // 驗證身分
  io.use(authenticated)

  // run when connect
  io.on('connection', async (socket) => {
    // emit user to frontend
    socket.emit('userInfo', socket.user)
    // 若使用者不存在 則加入 userList 並傳送系統歡迎訊息
    if (userIndex(users, socket.user.id) === -1) {
      // user first come into the chat : put userInfo to users
      users.push(socket.user)
      // send to single user
      socket.emit('chatMsg', formatMessage(botName, `${socket.user.name}, Welcome to chat!`))
      // send to other users
      socket.broadcast.emit('chatMsg', formatMessage(botName, `${socket.user.name} has joined the chat`))
    } else {
      // find chat records in db & emit to frontend
      let chatRecords = await Chat.findAll({
        raw: true,
        nest: true,
        include: [User]
      })
      chatRecords = chatRecords.map(record => ({
        id: record.id,
        text: record.message,
        time: record.time,
        UserId: record.UserId,
        username: record.User.name,
        avatar: record.User.avatar
      }))
      socket.emit('historyMsg', chatRecords)
    }

    // online count
    io.emit('onlineCount', users.length)

    // user list
    io.emit('userList', users)

    // listen for userMsg
    socket.on('userMsg', async (msg) => {
      const msgData = formatMessage(socket.user.name, msg)
      io.emit('chatMsg', msgData)
      // store in db
      if (msgData.text && msgData.time) {
        await Chat.create({
          UserId: socket.user.id,
          message: msgData.text,
          time: msgData.time
        })
      }
    })

    // run when client disconnect
    socket.on('disconnect', () => {
      // const userIndex = users.findIndex(user => user.id === socket.user.id)
      // if (userIndex !== -1) {
      //   users.splice(userIndex, 1)
      //   io.emit('chatMsg', formatMessage(botName, `${socket.user.name} has left the chat`))
      // }

      // online count
      io.emit('onlineCount', users.length)

      // user list
      io.emit('userList', users)
    })
  })
}

// lv3
// run when connect (lv2)
// io.on('connection', (socket) => {
//   // 預設進入 publicRoom

//   socket.join(socket.channel)
//   socket.to(socket.channel).emit('chatMsg', formatMessage(botName, `${socket.user.name}, Welcome to ${socket.channel}!`))

//   socket.emit('userName', socket.user.name)
//   const user = users.findIndex(user => user.id === socket.user.id)
//   if (user === -1) {
//     // user first come into the chat : put userInfo to users
//     users.push(socket.user)
//     // send to single user
//     socket.emit('chatMsg', formatMessage(botName, `${socket.user.name}, Welcome to chat!`))
//     // send to other users
//     socket.broadcast.emit('chatMsg', formatMessage(botName, `${socket.user.name} has joined the chat`))
//   } else {
//     // show history msg
//     socket.emit('historyMsg', userMsgs)
//   }

//   // user list
//   io.emit('userList', users)

//   // listen for userMsg
//   // socket.on('userMsg', (msg) => {
//   //   io.emit('chatMsg', formatMessage(socket.user.name, msg))
//   //   userMsgs.push(formatMessage(socket.user.name, msg))
//   // })

//   // listen for privateRoom
//   socket.on('privateMsg', (anotherUserId, msg) => {
//     socket.to(anotherSocketId).emit('privateMsg', socket.id, msg)
//   })

//   socket.on('privateRoom', data => {
//     const userList = []
//     const roomMsg = []
//     userList.push(socket.user.id, data.userId)
//     const roomName = userList.join('-')
//     // 存取使用者目前在的房間
//     socket.user.channel = roomName
//     // 切換房間
//     socket.join(roomName)

//     socket.emit('historyMsg', userMsgs)
//   })

//   // run when client disconnect
//   socket.on('disconnect', () => {
//     // take userInfo out of users
//     const userIndex = users.findIndex(user => user.id === socket.user.id)
//     users.splice(userIndex, 1)
//     // broadcast to everybody
//     socket.emit('chatMsg', formatMessage(botName, `${socket.user.name} has left the chat`))
//     // user list
//     io.emit('userList', users)
//   })
// })
