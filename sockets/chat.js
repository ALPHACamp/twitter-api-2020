const chatController = require('../controllers/chatController.js');

const chatSocket = async (io, socket, onlineUsers) => {
  // 第一次連線：傳回線上使用者清單列表，需要濾掉重複的 userId（一個使用者可能有多個 socket）
  console.log(`使用者 with socket id ${socket.id} 第一次連線`)

  const onlineUsersId = []
  onlineUsers.forEach(user => {
    if (!onlineUsersId.includes(user.userId)) onlineUsersId.push(user.userId)
  })

  const result = await chatController.getUsers(onlineUsersId).map(user => {
    return {
      id: user.id,
      avatar: user.avatar,
      name: user.name,
      account: user.account
    }
  })

  socket.emit('online-users', result)

  // === EVENT ===
  socket.on('disconnect', async () => {
    console.log(`一位使用者離線 with socket id ${socket.id}`)
    // 從使用者列表移除
    onlineUsers.splice(onlineUsers.findIndex(user => user.socketId === socket.id), 1)
  })

  socket.on('send', (obj) => {
    console.log(`使用者 with socket id ${socket.id} 已送訊息`, obj)
    // broadcast
    io.emit('message', {
      id: onlineUsers.find(user => user.socketId === socket.id).userId,
      time: new Date(),
      content: obj.content
    })
  })
}

module.exports = chatSocket
