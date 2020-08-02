const chatController = require('../controllers/chatController.js')

const jwt = require('jsonwebtoken')

const findUserIdBySocketId = (socketId, onlineUsers) => {
  return onlineUsers.filter(onlineUser => socketId == onlineUser.socketId)[0].userId
}

module.exports = (io) => {
  const onlineUsers = [] // 存放在線使用者資訊：{userId: xx, socketId: yy}

  io.use(async (socket, next) => {
    console.log('This is io use()')
    // 檢查有無帶 token
    if (!socket.handshake.query.token) return

    console.log(`token: ${socket.handshake.query.token}`)

    // 驗證 token
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log(err)
        return
      }

      // 加入使用者列表
      onlineUsers.push({ userId: decoded.id, socketId: socket.id })

      // === 給所有的 socket：傳送最新登入的使用者資訊 (不包含此 socket) ===
      const newUserId = decoded.id
      const newUser = await chatController.getUser(newUserId)
      const result = {
        id: newUser.id,
        avatar: newUser.avatar,
        name: newUser.name,
        account: newUser.account
      }

      console.log()
      console.log('server send "new-user" to all sockets')
      console.log(result)
      console.log()
      io.emit('new-user', result)

      return next()
    })
  })

  io.on('connect', (socket) => {
    // Client 離線
    socket.on('disconnect', async () => {
      // 從上線使用者列表移除
      const logoutUser = onlineUsers.splice(onlineUsers.findIndex(user => user.socketId === socket.id), 1)

      // === 給所有 socket：logout 使用者訊息 ===
      // 需確認 socket 中還有無此 userId 的 socket
      if (!onlineUsers.find(user => user.userId === logoutUser[0].userId)) {
        const userData = await chatController.getUser(logoutUser[0].userId)
        const result = {
          id: userData.id,
          name: userData.name,
          account: userData.account
        }

        console.log()
        console.log('Server send "logout" to all sockets')
        console.log(result)
        console.log()
        io.emit('logout', result)
      }

      // === 給所有的 socket：目前上線的使用者清單 ===
      // 撈取使用者 ID 清單（需要濾掉 socket 重複的 userId（一個使用者可能有多個 socket））
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

      console.log()
      console.log('Server send "online-users" to all sockets (disconnect)')
      console.log(result)
      console.log()
      io.emit('online-users', result)
    })

    // Client 寄送訊息
    socket.on('send', async (obj) => {
      const userId = onlineUsers.find(user => user.socketId === socket.id).userId
      const message = await chatController.postMessage(userId, obj.content)
      const result = {
        messageId: message.id,
        id: onlineUsers.find(user => user.socketId === socket.id).userId,
        time: new Date(),
        content: obj.content
      }

      // broadcast
      console.log()
      console.log('Server send "message" to all sockets')
      console.log(result)
      console.log()
      io.emit('message', result)
    })

    // Client 要撈取歷史訊息
    socket.on('old-message', async (obj) => {
      const oldMessage = []

      // 從 message id = startId 之後，撈取 count 個
      const messages = await chatController.getMessages(obj.startId, obj.count)
      await Promise.all(messages.map(message => chatController.getUser(message.userId)))
        .then(userDatas => {
          userDatas.map((userData, index) => {
            oldMessage.push({
              messageId: messages[index].id,
              time: messages[index].createdAt,
              content: messages[index].content,
              id: messages[index].userId,
              avatar: (userData.avatar) ? userData.avatar : '',
              name: userData.name,
              account: userData.account
            })
          })
        })

      console.log()
      const userId = findUserIdBySocketId(socket.id, onlineUsers)
      console.log(`Server send "old-message" to this sockets ${socket.id}, user id is ${userId} (old-message)`)
      console.log(oldMessage)
      console.log()
      socket.emit('old-message', oldMessage)
    })

    // Client 登入訊息
    socket.on('login', async () => {
      // === 給所有的 socket：目前上線的使用者清單 ===
      // 撈取使用者 ID 清單（需要濾掉 socket 重複的 userId（一個使用者可能有多個 socket））
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
      console.log()
      console.log('sever send "online-users" to all sockets')
      console.log(result)
      console.log()
      io.emit('online-users', result)

      // === 給此 socket：一開始先顯示 20 筆歷史訊息 ===
      const oldMessage = []
      const messages = await chatController.getMessages(0, 20)
      await Promise.all(messages.map(message => chatController.getUser(message.userId)))
        .then(userDatas => {
          userDatas.map((userData, index) => {
            oldMessage.push({
              messageId: messages[index].id,
              time: messages[index].createdAt,
              content: messages[index].content,
              id: messages[index].userId,
              avatar: (userData.avatar) ? userData.avatar : '',
              name: userData.name,
              account: userData.account
            })
          })
        })

      const userId = findUserIdBySocketId(socket.id, onlineUsers)
      console.log()
      console.log(`Server send "old-message" to this sockets ${socket.id}, user id is ${userId} (login)`)
      console.log(oldMessage)
      console.log()
      socket.emit('old-message', oldMessage)
    })
  })
}
