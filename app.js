const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const helpers = require('./_helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const session = require('express-session')
const cors = require('cors')
const passport = require('./config/passport')
const flash = require('connect-flash')
const app = express()
const port = process.env.PORT || 3000
//setup socket.io
const server = app.listen(port)
// const io = require("socket.io")()
const httpServer = require('http').createServer()
const io = require('socket.io')(httpServer, {
  cors: {
    origin: ["https://twitter-simple-one.herokuapp.com/api"],
    methods: ["GET", "POST"]
  }
})
const sio = io.listen(server)

// cors 的預設為全開放
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(bodyParser.urlencoded({ extended: true }))  // setup bodyParser
// app.use(bodyParser.json())
app.use(express.static('public'))
app.use(methodOverride('_method'))
// setup session and flash
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use('/upload', express.static(__dirname + '/upload'))
// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*')
  res.header("Access-Control-Allow-Credentials", true)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json')
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

// app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
  // res.json()
})

// io.on('connection', (socket) => { // 建立通道
//   console.log('a user connected')
//   socket.on('chat message', (msg) => {  
//     console.log('message: ' + msg)
//     io.emit('chat message', msg) 
//   })
// })
sio.on('connection', (socket) => { // 建立連線
  console.log('a user connected')
  socket.on('message', (msg) => {// server 收到 client 的訊息 (Emitting events:client往通道內丟的訊息)
    console.log(msg)
    socket.emit('message', msg) // broadcast：再透過通道把msg轉發給其他聊天室的使用者 
  })
})

// app.listen(port, () => {
//   console.log(`Example app listening on http://localhost:${port}`)
// })

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app)  // 把 passport 傳入 routes

module.exports = app
