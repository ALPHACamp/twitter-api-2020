const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const socketIo = require('socket.io')
const formatMessage = require('./utils/messages')

// .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT || 3000
const server = http.createServer(app)
const io = socketIo(server)

// 載入 cors
app.use(cors())

// 載入 bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// 載入 routes
require('./routes')(app)

// 設置錯誤訊息
app.use((err, req, res, next) => {
  if (err) {
    res.status(555).json({ message: String(err) })
    return next()
  }
})

// socket
const botName = 'Chat Bot'
io.on('connection', socket => {
  socket.emit('message', formatMessage(botName, 'Welcome to Chat!'))
  socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'))
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'A user has left the chat'))
  })
  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage('USER', msg))
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

server.listen(4000, () => console.log('Server is running on 4000'))

module.exports = app
