const join = require('./modules/join')
const leave = require('./modules/leave')
const sendMessage = require('./modules/sendMessage')

module.exports = io => {
  // test connection
  io.on('connection', socket => {
    console.log(socket.id)
    // 上線
    socket.on('client-join', account => join(io, socket, account))
    // 離線
    socket.on('client-leave', account => leave(io, socket, account))
    // 訊息
    socket.on('client-message', (account, message, room = null) => sendMessage(io, socket, account, message, room))
  })
}
