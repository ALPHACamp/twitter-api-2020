const express = require('express')
const app = express()

const http = require('http')
const socketIo = require('socket.io')
const server = http.createServer(app)
const io = socketIo(server)
const formatMessage = require('../utils/messages')

const authenticated = require('./auth')

app.get('/', (req, res) => {
  res.sendFile( __dirname + '/chat.html')
})

// 驗證身分
io.use(authenticated)

// 變數設定
const users = []
const userMsg = []
const botName = 'Chat Bot'

// run when connect
io.on('connection', socket => {
  // send to single user
  socket.emit('message', formatMessage(botName, `${socket.user.name}, Welcome to chat!`))

  // send to other users
  socket.broadcast.emit('message', formatMessage(botName, `${socket.user.name} has joined the chat`))

  // put userInfo to users
  if (users.findIndex(user => user.id === socket.user.id) === -1) {
    users.push(socket.user)
  }

  // online count
  io.emit('online', users.length)

  // listen for chat-msg
  socket.on('chat-msg', (msg) => {
    io.emit('message', formatMessage(socket.user.name, msg))
    userMsg.push(formatMessage(socket.user.name, msg))
  })

  // run when client disconnect
  socket.on('disconnect', () => {
    // broadcast to everybody
    io.emit('message', formatMessage(botName, `${socket.user.name} has left the chat`))
  })
})

module.exports = server
