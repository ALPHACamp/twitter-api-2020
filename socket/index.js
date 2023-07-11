const join = require('./modules/join')
const leave = require('./modules/leave')
const sendMessage = require('./modules/sendMessage')
const disconnect = require('./modules/disconnect')
const record = require('./modules/record')
const getRoom = require('./modules/getRoom')
const newMessage = require('./modules/newMessage')

module.exports = io => {
  io.on('connection', socket => {
    console.log(socket.id)

    // 上線
    socket.on('client-join', account => join(io, socket, account))
    // 離線
    socket.on('client-leave', account => leave(io, socket, account))
    // 傳送訊息
    socket.on('client-message', (message, time, roomId) =>
      sendMessage(io, socket, message, time, roomId)
    )
    // 歷史訊息
    socket.on('client-record', room => record(io, socket, room))
    // 私人聊天室的最新訊息
    socket.on('client-new-message', () => newMessage(io, socket))
    // 取得我跟對象的roomId
    socket.on('client-get-room', targetId => getRoom(io, socket, targetId))

    // 使用者斷線
    socket.on('disconnect', reason => disconnect(io, socket, reason))
  })
}
