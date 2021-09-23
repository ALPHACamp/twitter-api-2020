const express = require('express')
const helpers = require('./_helpers')
const apiErrorHandler = require('./middleware/errorHandler')
const cors = require('cors')
const methodOverride = require('method-override')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require('./routes')
const passport = require('./config/passport')
const app = express()
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const server = require('http').createServer(app)
const io = socketio(server)

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(passport.initialize())

app.use(methodOverride('_method'))

app.use('/upload', express.static(__dirname + '/upload'))

app.use(routes)

app.use(apiErrorHandler)

app.use(express.static('public'))

// when user go to the website return index.html
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})

io.on('connection', function (socket) {
  console.log('user connected')
  // 建立一個 "sendMessage" 的監聽
  socket.on('sendMessage', function (message) {
    console.log(message)
    // 當收到事件的時候，也發送一個 "allMessage" 事件給所有的連線用戶
    io.emit('allMessage', message)
  })
})

// io.on('connection', (socket) => {
//   socket.on('new-user', (name) => {
//     users[socket.id] = name
//     socket.broadcast.emit('user-connected', name)
//   })
//   socket.on('send-chat-message', (message) => {
//     socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
//   })
//   socket.on('disconnect', () => {
//     socket.broadcast.emit('user-disconnected', users[socket.id])
//     delete users[socket.id]
//   })
// })

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app
