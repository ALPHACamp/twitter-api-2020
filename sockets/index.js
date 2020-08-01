const chatSocket = require('./chat.js')
const notification = require('./notification.js')

module.exports = (io) => {
  io.on('connect', (socket) => {
    console.log('新增一個使用者連線')

    // 使用 chatSocket 功能 (sockets/chat.js)
    chatSocket(io, socket)
  })

}

