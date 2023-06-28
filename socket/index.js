const join = require('./modules/join')
const leave = require('./modules/leave')
const message = require('./modules/message')

module.exports = io => {
  // Fired upon a connetion from client
  io.on('connection', socket => {
    console.log(socket.io)

    // user加入聊天室
    socket.on('client-join', account => join(io, socket, account))

    // user離開聊天室
    socket.on('client-leave', account => leave(io, socket, account))

    // 當有user發送message時
    socket.on('client-message', (account, mes) => message(io, socket, account, mes))
  })
}
