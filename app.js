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

const ENTER = 0
const LEAVE = 1
const MESSAGE = 2

let count = 0

io.on('connection', socket => {
  console.log('user connected')
  count++
  let user = `用户${count}`

  io.sockets.emit('broadcast_msg',
    {
      type: ENTER,
      msg: `${user}加入群聊`,
      time: new Date().toLocaleString()
    }
  )

  socket.on('send_msg', (data) => {
    console.log(`收到客户端的消息：${data}`)
    io.sockets.emit('broadcast_msg', {
      type: MESSAGE,
      msg: `${user}:${data}`,
      time: new Date().toLocaleString()
    })
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
    io.sockets.emit('broadcast_msg', {
      type: LEAVE,
      msg: `${user}离开了群聊`,
      time: new Date().toLocaleString()
    })
    count--
  })
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// app.get('/', (req, res) => res.send('Hello World!'))
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// module.exports = app

server.listen(3000, () => {
  console.log('listening on *:3000')
})

const router = require('./routes')
router(app)
module.exports = app
