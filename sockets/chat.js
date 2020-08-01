
const chatSocket = (io, socket) => {

  // socket.on('connect', () => {
  //   io.emit('connect', '你上線了')
  // })

  socket.on('disconnect', () => {
    console.log('一位使用者離線')
    io.emit('disconnect', '收到字串了嗎')
  })

  socket.on('send', (obj) => {
    console.log('obj', obj)
    console.log('使用者已送訊息')
    io.emit('send', '歡迎你來')
  })

  socket.on('online-users', (obj) => {
    console.log('msg', `One more user`)
    io.emit('online-users', '歡迎你來成為 online-user')
  })

  socket.on('message', msg => {
    console.log('message: ' + msg)
    io.emit('message', [msg, JSON.stringify({ status: 'success', message: '新增一個使用者' })])
  })

}

module.exports = chatSocket