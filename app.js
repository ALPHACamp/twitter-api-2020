const express = require('express')
const session = require('express-session')
const helpers = require('./_helpers');
const cors = require('cors')
const { Message } = require('./models')
const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT || 3000
// Create http server for socket.io
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})
const passport = require('./config/passport')

// cors 的預設為全開放
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use('/upload', express.static(__dirname + '/upload'))
app.use((req, res, next) => {
  req.user = helpers.getUser(req)
  next()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
server.listen(4040, () => {
  console.log(`socketio server listening on port 4040!`)
})

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/view/index.html')
})

// 在線人數
let onlineCounts = 0

// 連線錯誤監聽
io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
})

// socket.id and userId mapping
const socketMap = {}

// 連線監聽
io.on('connection', async (socket) => {
  // 連線發生時發送人數給網頁
  onlineCounts += 1
  io.emit('online', onlineCounts)
  console.log('new user connected')

  // 請求 new user socket
  io.emit('newUser')

  // 接收 new user socket 建立 MAP
  socket.on('newUser', userId => {
    socketMap[userId] = socket.id
    console.log(socketMap)
  })

  try {
    // 發送之前的全部訊息
    msgs = await Message.findAll({
      raw: true,
      nest: true,
      where: { isPublic: true },
      order: [['createdAt', 'ASC']]
    })
    console.log(msgs)
    io.to(socket.id).emit('historyMessages', msgs)
  } catch (err) {
    console.log(err)
  }

  // 公開訊息監聽
  socket.on('newMessage', async (msg) => {
    try {
      // 前端傳來的訊息為空 return
      if (!msg.content) return

      const senderId =
        Object.keys(socketMap).find(key => {
          socketMap[key] == socket.id
        })
      const { receiverId, content, isPublic } = msg
      // 新訊息放進資料庫
      await Message.create({
        senderId, receiverId, content, isPublic
      })

      // broadcasting to all connected sockets
      io.emit('newMessage', msg)
      console.log('message: ' + msg)
    } catch (err) {
      console.log(err)
    }
  })

  // 離線監聽
  socket.on('disconnect', () => {
    // 離開時減少聊天室人數並發送給網頁
    onlineCounts = (onlineCounts <= 0) ? 0 : onlineCounts -= 1
    io.emit('online', onlineCounts)
    console.log('disconnected')
  })
})

require('./routes')(app)

module.exports = app
