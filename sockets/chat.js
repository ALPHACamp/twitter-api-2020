const chatController = require('../controllers/chatController.js');

const chatSocket = async (io, socket, onlineUsers) => {
  // 第一次連線：傳回線上使用者清單列表，需要濾掉重複的 userId（一個使用者可能有多個 socket）
  console.log(`使用者 with socket id ${socket.id} 第一次連線`)

  // TODO: 現在 message 總共有多少個（for 撈取歷史訊息用）

  const onlineUsersId = []
  onlineUsers.forEach(user => {
    if (!onlineUsersId.includes(user.userId)) onlineUsersId.push(user.userId)
  })

  try {
    const result = await chatController.getUsers(onlineUsersId).map(user => {
      return {
        id: user.id,
        avatar: user.avatar,
        name: user.name,
        account: user.account
      }
    })

    socket.emit('online-users', result)
    // TODO: 一開始先顯示 n 筆歷史訊息
  } catch (err) {
    console.warn(err)
  }

  // === EVENT ===
  socket.on('disconnect', () => {
    console.log(`一位使用者離線 with socket id ${socket.id}`)
    // 從使用者列表移除
    onlineUsers.splice(onlineUsers.findIndex(user => user.socketId === socket.id), 1)
  })

  socket.on('send', async (obj) => {
    try {
      console.log(`使用者 with socket id ${socket.id} 已送訊息`, obj)

      const userId = onlineUsers.find(user => user.socketId === socket.id).userId
      await chatController.postMessage(userId, obj.content)

      // broadcast
      io.emit('message', {
        id: onlineUsers.find(user => user.socketId === socket.id).userId,
        time: new Date(),
        content: obj.content
      })
    } catch (err) {
      console.warn(err)
    }
  })

  socket.on('old-message', async (obj) => {
    console.log(`使用者 with socket id ${socket.id} 欲撈取歷史訊息`)
    try {
      // FIXME: 待與前端確認傳什麼參數、怎麼撈
      const result = await chatController.getMessages(obj.start, obj.count)
      socket.emit('old-message', result)
    } catch (err) {
      console.warn(err)
    }
  })
}

module.exports = chatSocket
