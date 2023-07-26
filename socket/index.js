const join = require('./modules/join')
const leave = require('./modules/leave')
const sendMessage = require('./modules/sendMessage')
const disconnect = require('./modules/disconnect')
const record = require('./modules/record')
const getRoom = require('./modules/getRoom')
const newMessage = require('./modules/newMessage')
const enterRoom = require('./modules/enterRoom')
const leaveRoom = require('./modules/leaveRoom')
const subscribe = require('./modules/subscribe')
const unsubscribe = require('./modules/unsubscribe')
const pushNotice = require('./modules/pushNotice')
const getNotice = require('./modules/getNotice')

module.exports = io => {
  io.on('connection', socket => {
    console.log(socket.id)

    // 上線
    socket.on('client-join', userId => join(io, socket, userId))
    // 離線
    socket.on('client-leave', userId => leave(socket))
    // 傳送訊息
    socket.on('client-message', (message, time) =>
      sendMessage(io, socket, message, time)
    )
    // 歷史訊息
    socket.on('client-record', room => record(socket, room))
    // 私人聊天室的最新訊息
    socket.on('client-new-message', () => newMessage(socket))
    // 取得我跟目標的roomId
    socket.on('client-get-room', targetId => getRoom(io, socket, targetId))

    // 進入房間(開始閱讀)
    socket.on('client-enter-room', roomId => enterRoom(socket, roomId))
    // 離開房間(停止閱讀)
    socket.on('client-leave-room', roomId => leaveRoom(socket, roomId))

    // 訂閱
    socket.on('client-subscribe', targetId => subscribe(socket, targetId))
    // 取消訂閱
    socket.on('client-unsubscribe', targetId => unsubscribe(socket, targetId))

    // 觸發通知
    socket.on('client-push-notice', (action, targetId) =>
      pushNotice(socket, action, targetId)
    )
    // 取得通知
    socket.on('client-get-notice', () => getNotice(socket))

    // 使用者斷線
    socket.on('disconnect', reason => disconnect(socket, reason))
  })
}
