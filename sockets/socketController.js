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
// io.use(authenticated)

const users = {}
const botName = 'Chat Bot'
// run when connect
io.on('connection', socket => {
  io.use(authenticated)
  // send to single user
  socket.emit('message', formatMessage(botName, 'Welcome to chat!'))

  // listen for newUser
  socket.on('new-user', name => {
    users[socket.id] = name
    console.log('users', users)
    socket.broadcast.emit('user-connected', formatMessage(botName, `${name} has joined the chat`))
    // listen for chatMsg
    socket.on('chatMsg', (msg) => {
      io.emit('message', formatMessage(name, msg))
    })
  })

  // run when client disconnect
  socket.on('disconnect', () => {
    // broadcast to everybody
    io.emit('message', formatMessage(botName, `${users[socket.id]} has left the chat`))
  })
})

module.exports = server
