const formatMessage = require('./utils/messages')
const authenticated = require('./utils/auth')

module.exports = (io) => {
  // 驗證身分
  io.use(authenticated)

  // 變數設定
  const users = []
  const userMsgs = []
  const botName = 'Chat Bot'

  // run when connect (lv2)
  io.on('connection', (socket) => {
    // emit user to frontend
    socket.emit('userInfo', socket.user)
    const user = users.findIndex(user => user.id === socket.user.id)
    if (user === -1) {
      // user first come into the chat : put userInfo to users
      users.push(socket.user)
      // send to single user
      socket.emit('chatMsg', formatMessage(botName, `${socket.user.name}, Welcome to chat!`))
      // send to other users
      socket.broadcast.emit('chatMsg', formatMessage(botName, `${socket.user.name} has joined the chat`))
    } else {
      // show history msg
      socket.emit('historyMsg', userMsgs)
    }

    // online count
    io.emit('onlineCount', users.length)

    // user list
    io.emit('userList', users)

    // listen for userMsg
    socket.on('userMsg', (msg) => {
      io.emit('chatMsg', formatMessage(socket.user.name, msg))
      userMsgs.push(formatMessage(socket.user.name, msg))
    })

    // run when client disconnect
    socket.on('disconnect', () => {
      // // take userInfo out of users
      const userIndex = users.findIndex(user => user.id === socket.user.id)
      if (userIndex !== -1) {
        users.splice(userIndex, 1)
        // broadcast to everybody
        io.emit('chatMsg', formatMessage(botName, `${socket.user.name} has left the chat`))
      }
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
