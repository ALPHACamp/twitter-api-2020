const chatController = require('../controllers/chatController.js');

const chatSocket = (io, socket, users) => {

  // 第一次連線：傳回線上使用者清單列表，需要濾掉重複的 userId（一個使用者可能有多個 socket）
  // const onlineUsersId = []
  // users.forEach(user => {
  //   if (!onlineUsersId.includes(user.userId)) {
  //     onlineUsersId.push(user.userId)
  //     /*
  //     onlineUsersId.push({
  //       id: user.userId,
  //       avatar: '',
  //       name: '',
  //       account: ''
  //     })
  //     */
  //   }
  // })

  // console.log(onlineUsersId)
  // console.log(chatController.getUsers(onlineUsersId))
  // const response = chatController.getUsers(onlineUsersId).map(user => {
  //   return {
  //     id: user.id,
  //     avatar: user.avatar,
  //     name: user.name,
  //     account: user.account
  //   }
  // })

  io.emit('online-users', 'hi')

  socket.on('disconnect', () => {
    console.log(`一位使用者離線 with socket id ${socket.id}`)
    users.splice(users.findIndex(user => user.socketId === socket.id), 1)
    console.log(users)
  })

  socket.on('send', (obj) => {
    console.log('使用者已送訊息', obj)
    // broadcast
    io.emit('message', {
      id: users.find(user => user.socketId === socket.id).userId,
      time: new Date(),
      content: obj.content
    })
  })
}

module.exports = chatSocket
