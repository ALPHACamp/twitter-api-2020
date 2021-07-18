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
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
})
const passport = require('./config/passport');
const { SSL_OP_NO_TICKET } = require('constants');

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


app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/view/index.html')
})

// 群聊在線人數
let onlineCounts = 0
onlineUser = []

// 連線錯誤監聽
io.on("connect_error", (err, next) => {
  console.log(`connect_error due to ${err.message}`)
  next(err)
})

// 連線監聽
io.on('connection', async (socket) => {
  // 連線發生時發送人數給網頁
  onlineCounts += 1
  io.emit('online', onlineCounts)
  console.log('new user connected')

  // 請求 new user socket
  io.to(socket.id).emit('newUser')

  // 接收 current user 回傳 onlineUser array
  socket.on('newUser', user => {
    socket.user = user
    onlineUser.push(user)
    console.log(onlineUser)

    io.emit('onlineUser', onlineUser)
    socket.broadcast.emit('userJoin', socket.user)
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
  socket.on('sendMessage', async (msg) => {
    try {
      // 前端傳來的訊息為空 return
      if (!msg.content) return
      // 取得 sender id
      const senderId = socket.user.id
      if (!senderId) return

      const { content, isPublic } = msg
      // 新訊息放進資料庫
      let message = await Message.create({
        senderId, content, isPublic
      })

      // 傳新訊息給所有人
      io.emit('newMessage', message.toJSON())
      console.log('message: ' + msg)
    } catch (err) {
      console.log(err)
    }
  })

  // 離線監聽
  socket.on('disconnect', () => {
    // 離開時減少聊天室人數並發送給網頁
    onlineCounts = (onlineCounts <= 0) ? 0 : onlineCounts -= 1
    onlineUser = onlineUser.filter(user => user.id !== socket.user.id)
    io.emit('online', onlineCounts)
    io.emit('onlineUser', onlineUser)
    io.emit('userLeave', socket.data.user)
    console.log('disconnected')
  })
})

require('./routes')(app)

module.exports = app
