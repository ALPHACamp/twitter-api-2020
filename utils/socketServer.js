const jwt = require('jsonwebtoken')
const db = require('../models')
const Chat = db.Chat
const User = db.User
const onlineUser = []

module.exports = async (io) => {
  // user token 驗證
  io.use(async (socket, next) => {
    const token = socket.handshake.query.token
    if (!token) { return }
    else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      let user = await User.findByPk(decoded.id, {
        raw: true, nest: true,
        attributes: ['id', 'name', 'account', 'avatar']
      })
      onlineUser.push(user)
      next()
    }
  }).on('connection', (socket) => {
    socket.on('joinRoom', async () => {
      console.log('user connected 有人進來了')
      // 從資料庫抓取歷史訊息
      const record = await Chat.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'ASC']],
      })
      // 載入歷史訊息
      socket.emit('allMsg', record)
      // 一連線後的廣播
      io.emit('welcome message', '歡迎來到公開聊天室！')
      // 丟 onlineUser 給前端
      io.emit('onlineUser', onlineUser)
    })
    
    // 接收 client 端
    socket.on('giveServer', function (message) {
      console.log(message)
    })
    socket.on('userPro', function (message) {
      console.log(message)
    })
    
    // 監聽
    socket.on('chat message', (msg) => {
      Chat.create({
        UserId: msg.UserId,
        message: msg.message,
      })
      // 廣播收到的訊息給大家
      io.emit('chat message', msg)
      console.log('message: ' + msg)
    })
    socket.on('disconnect', () => {
      io.emit('byeMsg', `Byeeeeeee`)
      console.log('user disconnected')
    })
  })
}
