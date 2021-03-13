const jwt = require('jsonwebtoken')
const db = require('../models/index')
const { User, Message } = db
const errorResponse = (errorMsg) => ({ status: 'error', message: errorMsg })

module.exports = function (io) {
  io.use(async (socket, next) => {
    // authentication
    const token = socket.handshake.auth.token // frontend - socket.userId = 1; socket.connect()
    console.log('token:', token)
    if (!token) return next(new Error('建立連線失敗，請先登入。'))
    let userId = 0
    await jwt.verify(token, process.env.JWT_SECRET, (payload) => {
      if (!payload) return next(new Error('建立連線失敗，無效 token。'))
      userId = payload.id
    })
    if (!userId) return next(new Error('建立連線失敗，無效 userId。'))
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'name', 'account', 'avatar']
    })
    if (!user) return next(new Error('No user found'))

    socket.user = user.toJSON()
    next()
  })

  io.on('connection', async (socket) => {
    console.log('connect successfully!')
    const socketUserId = String(socket.user.id)
    //enter self room
    socket.join(socketUserId)
    //fetch chat history (all previous msg) and send to new socket
    let messages = await Message.findAll({
      include: [
        { model: User, as: 'from', exclude: ['password'] },
        { model: User, as: 'to', exclude: ['password'] }
      ]
    })
    if (!messages || !Array.isArray(messages)) {
      return socket.to(socketUserId).emit('fetchMessagesFail', errorResponse('獲取聊天紀錄失敗'))
    } 
    messages = JSON.parse(JSON.stringify(messages))
    const publicMessageRecord = messages.filter(message => message.toId === null)
    socket.to(socketUserId).emit('publicMessageRecord', publicMessageRecord) 
    // fetch existing users
    const usersInPublicChat = []
    // io.of('/').sockets is a Map with socketId as key => socket as value
    for (const [id, socket] of io.of('/').sockets) {
      // socket.user = { id, name, account, avatar }
      usersInPublicChat.push(socket.user)
    }
    socket.emit('usersInPublicChat', usersInPublicChat) // emit user list to frontend
    // listen to publicMessage, then broadcast message to all users(sockets)
    socket.on('publicMessage', async (publicMessage) => {
      console.log('Someone wants to send a public message')
      // msg is an object = { content, fromId, toId: null }
      socket.emit('publicMessage', publicMessage)
      await Message.create(publicMessage)
    })


    //private messaging section
    const privateMessages = messages
      .filter(msg => msg.toId !== null)
      .filter(msg => String(msg.toId) === socketUserId || String(msg.fromId) === socketUserId)
    const messagePerUser = new Map()
    privateMessages.map(msg => {
      const anotherUserId = socketUserId === String(msg.fromId) ? String(msg.toId) : String(msg.fromId)
      if (!messagePerUser.has(anotherUserId)) {
        messagePerUser.set(anotherUserId, [msg])
      } else {
        messagePerUser.get(anotherUserId).push(msg)
      }
    })

    const usersInPrivateChat = []
    const userPromises = []
    messagePerUser.forEach((anotherUserId, msgs) => {
      userPromises.push(User.findOne({ where: { id: anotherUserId }, exclude: ['password'] }))
      usersInPrivateChat.push({
        connected: usersInPublicChat.map(d => d.id).includes(anotherUserId),
        conversation: msgs
      })
    })
    let userData = await Promise.all(userPromises)
    userData = JSON.parse(JSON.stringify(userData))
    userData.map((data, index) => {
      Object.assign(usersInPrivateChat[index], data)
    })
    socket.to(socketUserId).emit('usersInPrivateChat', usersInPrivateChat)

    socket.on('privateMessage', async (privateMessage) => {
      console.log('someone wants to send a private message')
      socket.to(privateMessage.toId).to(socketUserId).emit('privateMessage', privateMessage)
      await Message.create(privateMessage)
    })


    // broadcast username to frontend when someone is connected.
    socket.broadcast.emit('userConnected', {
      id: socketUserId,
      username: socket.user.name,
      connected: true
    })
    // notify users upon disconnection
    socket.on('disconnect', () => {
      console.log('someone is disconnected')
      socket.broadcast.emit('userDisconnected', {
        //front end use this id to toggle connected status (true => false)
        id: socketUserId,
        username: socket.user.name,
        connected: false
      })
    })
  })
}
