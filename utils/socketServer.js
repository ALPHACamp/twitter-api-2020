const jwt = require('jsonwebtoken')
const db = require('../models')
const Chat = db.Chat
const User = db.User
let onlineUser = []

module.exports = async (io) => {
  // user token 驗證
  io.use(async (socket, next) => {
    const token = socket.handshake.query.token
    if (!token) {
      const err = new Error('not authorized')
      err.data = { content: 'Please retry later' }
      next(err)
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findByPk(decoded.id, {
        raw: true,
        nest: true,
        attributes: ['id', 'name', 'account', 'avatar'],
      })
      socket.user = user
      const ifExist = onlineUser.some((user) => user.id === socket.user.id)
      if (!ifExist) {
        onlineUser.push(user)
      }
      next()
    }
  }).on('connection', (socket) => {
    socket.on('joinRoom', async () => {
      console.log('user connected')
      // 從資料庫抓取歷史訊息
      const record = await Chat.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'ASC']],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'account', 'avatar'],
          },
        ],
      })
      // 載入歷史訊息
      socket.emit('allMsg', record)
      // 一連線後的廣播
      const welcomeMsg = `歡迎${socket.user.name}來到公開聊天室！`
      io.emit('broadcast', { broadcast: welcomeMsg })
      // 丟 onlineUser 給前端
      io.emit('onlineUser', onlineUser)
    })

    // 監聽
    socket.on('chat message', (msg) => {
      Chat.create({
        UserId: msg.UserId,
        message: msg.message,
      })
      // 廣播收到的訊息給大家
      const current = {
        User: socket.user,
        message: msg.message,
        createdAt: msg.createdAt,
      }
      io.emit('chatMsg', current)
      console.log('message: ' + msg.message)
    })
    socket.on('disconnect', () => {
      console.log(socket.user.name)
      const {id, name} = socket.user
      const byeMsg = `${name} 下線了，掰掰！`
      io.emit('broadcast', { broadcast: byeMsg })
      // 刪除 onlineUser
      onlineUser = onlineUser.filter((user) => user.id !== id)
      console.log('user disconnected')
    })
  })
}
