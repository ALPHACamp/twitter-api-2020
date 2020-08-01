// params
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const port = process.env.PORT || 3000

// modules and files
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('./config/passport.js')
const routes = require('./routes/index.js')

// web server settings
const app = express()

// socket.io 設定
const socketApp = require('http').createServer(app)
const io = require('socket.io')(socketApp, { origins: '*:*' })

// other middleware settings, request will go through this part
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors())

// socket.io 開發測試用 HTML 和路由
app.get('/chats', (req, res) => {
  res.sendFile(__dirname + '/SOCKETIO_TEST.html')
})

// routes
app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api', routes)
app.use(cors())

// start API web server
app.listen(port, () => console.log(`API Web Server app listening on port ${port}!`))

// Socket.io 連接埠和 listener
const socketPort = 4000
socketApp.listen(socketPort, () => {
  console.log(`Socket 服務啟動 ${socketPort}`)
})

require('./sockets')(io)

module.exports = app
