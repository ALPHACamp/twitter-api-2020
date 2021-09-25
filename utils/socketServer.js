const db = require('../models')
const Chat = db.Chat

module.exports = async (io) => {
  // 從資料庫抓取歷史訊息
  const record = await Chat.findAll({
    raw: true,
    nest: true,
    order: [
      ['createdAt', 'ASC']
    ]
  })
  io.on('connection', (socket) => {
    // 一連線後的廣播
    // socket.emit('hi everyone')
    io.emit('welcome message', `welcome to this room`)
    console.log('a user connected')

    // 接收 client 端
    socket.on('giveServer', function (message) {
      console.log(message)
    })
    socket.on('userPro', function (message) {
      console.log(message)
    })
    // 載入歷史訊息
    socket.emit('allMsg', record)

    // 監聽
    socket.on('chat message', (msg) => {
      Chat.create({
        UserId: msg.UserId,
        message: msg.message
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
