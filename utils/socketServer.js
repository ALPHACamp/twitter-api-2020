const db = require('../models')
const Chat = db.Chat

module.exports = (io) => {
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
    // 監聽
    socket.on('chat message', (msg) => {
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

