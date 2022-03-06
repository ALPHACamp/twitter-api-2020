const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/socket/index.html')
})

// 接收連線訊息，socket架設於http server之上
io.on('connection', (socket) => {
  console.log('a user connect')
  // 廣播訊息物件{msg: msg}給所有人，通道名稱為chat message
  socket.on('chat message', (msg) => {
    io.emit('chat message', {
      msg
    })
  })
  // 使用者離開頁面呼叫
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(4040, () => {
  console.log('listen on port: 4040')
})