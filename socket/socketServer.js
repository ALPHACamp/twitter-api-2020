const jwt = require('jsonwebtoken')
const db = require('../models/index')
const { User, Message } = db
const errorResponse = (errorMsg) => ({ status: 'error', message: errorMsg })

module.exports = function (io) {
  io.use(async (socket, next) => {
    // authentication
    const token = socket.handshake.auth.token // frontend - socket.userId = 1; socket.connect()
    console.log('token', token)
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
    //enter self room
    socket.join(socket.user.id)
    //fetch chat history (all previous msg) and send to new socket
    let publicMessageRecord = await Message.findAll({
      where: { toId: null },
      include: { model: User, as: 'from' }
    })
    if (!publicMessageRecord || !Array.isArray(publicMessageRecord)) {
      return socket.to(socket.user.id).emit('fetchMessagesRecordFail', errorResponse('獲取聊天紀錄失敗'))
    } 
    publicMessageRecord = JSON.parse(JSON.stringify(publicMessageRecord))
    socket.to(socket.user.id).emit('publicMessageRecord', publicMessageRecord) 
    // fetch existing users
    const onlineUsers = []
    // io.of('/').sockets is a Map with socketId as key => socket as value
    for (const [id, socket] of io.of('/').sockets) {
      // socket.user = { id, name, account, avatar }
      onlineUsers.push(socket.user)
    }
    //fetch all users
    const allUsers = await User.findAll({ attributes: { exclude: ['password'] } })
    if (!allUsers || !Array.isArray(allUsers)) {
      return socket.to(socket.user.id).emit('fetchAllUsersFail', errorResponse('獲取使用者列表失敗'))
    }
    allUsers.map(user => {
      user.connected = onlineUsers.map(d => d.id).includes(user.id)
      return user
    })
    socket.emit('users', allUsers) // emit updated all user list to frontend - [{socketID: id, user: socket.user}, {}, ...]

    // broadcast username to frontend when someone is connected.
    socket.broadcast.emit('userConnected', {
      username: socket.user.name
    })

    // listen to publicMessage, then broadcast message to all users(sockets)
    socket.on('publicMessage', async (msg) => {
      // msg is an object = { content, fromId, toId: null }
      socket.emit('publicMessage', msg)
      await Message.create(msg)
    })

    // notify users upon disconnection
    socket.on('disconnect', () => {
      socket.broadcast.emit('user disconnected', {
        //front end use this id to toggle connected status (true => false)
        id: socket.user.id,
        username: socket.user.name
      })
    })
  })
}
