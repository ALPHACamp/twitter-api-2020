const chatController = require('../controllers/chatController.js');

// 透過 socket id 來找到對應的 user id
const findUserIdBySocketId = (socketId, onlineUsers) => {
  onlineUsers.filter(onlineUser => {
    socketId === onlineUser.socketId
    return onlineUser.userId
  })
}

const chatSocket = async (io, socket, onlineUsers) => {
  // 第一次連線：傳回線上使用者清單列表，需要濾掉重複的 userId（一個使用者可能有多個 socket）
  console.log(`使用者 with socket id ${socket.id} 第一次連線`)

  // TODO: 現在 message 總共有多少個（for 撈取歷史訊息用）

  const onlineUsersId = []
  onlineUsers.forEach(user => {
    if (!onlineUsersId.includes(user.userId)) onlineUsersId.push(user.userId)
  })

  // 最新加入的 user 的 id
  const newUserId = onlineUsersId[onlineUsersId.length - 1]

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
  socket.on('new-user', async () => {
    console.log('新加入一位使用者 id =', newUserId)
    console.log('新加入一位使用者 socket id =', socket.id)

    try {
      const userData = await chatController.getUser(newUserId)

      if (!userData) {
        console.log('查無此人')
      } else {
        io.emit('new-user', {
          id: userData.id,
          avatar: userData.avatar,
          name: userData.name,
          account: userData.account
        })
      }
    } catch (err) {
      console.log(err)
    }
  })

  // disconnect 事件一發生，就會立即取消 socket，callback 只會執行同步程式
  socket.on('disconnect', async () => {
    console.log(`一位使用者離線 with socket id ${socket.id}`)
    // 從使用者列表移除
    const logoutUser = onlineUsers.splice(onlineUsers.findIndex(user => user.socketId === socket.id), 1)

    // 確認 socket 中還有無此 userId 的 socket
    if (!onlineUsers.find(user => user.userId === logoutUser[0].userId)) {
      console.log(`userId ${logoutUser[0].userId} 沒有重複 socket，故可以移了`)
      const userData = await chatController.getUser(logoutUser[0].userId)
      io.emit('logout', {
        id: userData.id,
        name: userData.name,
        account: userData.account
      })
    }
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
