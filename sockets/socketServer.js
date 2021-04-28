const formatMessage = require('./utils/messages')
const authenticated = require('./utils/auth')

module.exports = (io) => {
  // 驗證身分
  io.use(authenticated)

  // 變數設定
  const users = []
  const userMsgs = []
  const botName = 'Chat Bot'

  // run when connect
  io.on('connection', (socket) => {
    const user = users.findIndex(user => user.id === socket.user.id)
    if (user === -1) {
      // user first come into the chat : put userInfo to users
      users.push(socket.user)
      // send to single user
      socket.emit('userName', socket.user.name)
      socket.emit('chatMsg', formatMessage(botName, `${socket.user.name}, Welcome to chat!`))
      // send to other users
      socket.broadcast.emit('chatMsg', formatMessage(botName, `${socket.user.name} has joined the chat`))
    } else {
      // send to single user
      socket.emit('userName', socket.user.name)
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
      // take userInfo out of users
      // const userIndex = users.findIndex(user => user.id === socket.user.id)
      // users.splice(userIndex, 1)
      // broadcast to everybody
      // io.emit('chatMsg', formatMessage(botName, `${socket.user.name} has left the chat`))
      // online count
      io.emit('onlineCount', users.length)
      // user list
      io.emit('userList', users)
    })
  })
}
