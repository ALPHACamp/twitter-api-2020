if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')

const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

// cors 的預設為全開放
app.use(cors())

// 即時互動(即時聊天 polling)，建立通道 server + 引入 socket.io
const http = require('http')
const server = http.createServer(app)
const socketIO = require('socket.io')

const io = socketIO(server, {
  cors: {
    origin: '*'
  }
})

let count = 0

io.on('connection', socket => {
  count++
  let user = `User ${count} `

  // io.sockets.emit('broadcast_msg', {
  //   type: 'enter',
  //   inputText: `${user}加入聊天室`
  // }
  // )
  socket.on('enter_chat', (data) => {
    io.sockets.emit('broadcast_msg', {
      type: 'enter',
      inputText: `${data.user.name} 進入聊天室`
    })
  })

  socket.on('send_msg', (data) => {
    io.sockets.emit('broadcast_msg', {
      type: 'message',
      inputText: data.inputText,
      time: new Date().toLocaleString(),
      user: {
        id: data.user.id,
        name: data.user.name,
        avatar: data.user.avatar
      }
    })
  })

  socket.on('disconnect', () => {
    io.sockets.emit('broadcast_msg', {
      type: 'leave',
      inputText: `${user}離開聊天室`,
    })
    count--
  })
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// module.exports = app

server.listen(3030, () => {
  console.log('listening on *:3030')
})

const router = require('./routes')
router(app)
module.exports = app
