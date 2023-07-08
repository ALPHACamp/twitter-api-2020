const join = require('./modules/join')
const leave = require('./modules/leave')
const sendMessage = require('./modules/sendMessage')
const disconnect = require('./modules/disconnect')
const record = require('./modules/record')
const getRoom = require('./modules/getRoom')

module.exports = io => {
  io.on('connection', socket => {
    console.log(socket.id)

    // 上線
    socket.on('client-join', account => join(io, socket, account))
    // 離線
    socket.on('client-leave', account => leave(io, socket, account))
    // 傳送訊息
    socket.on('client-message', (account, message, room = null) => sendMessage(io, socket, account, message, room))
    // 歷史訊息
    socket.on('client-record', (room = null) => record(io, socket, room))
    // 取得我跟對象的roomId
    socket.on('client-get-room', targetId => getRoom(socket, targetId))

    // 使用者斷線
    socket.on('disconnect', reason => disconnect(io, socket, reason))
  })
}
