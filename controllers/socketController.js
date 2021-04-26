const express = require('express')
const app = express()

const http = require('http')
const socketIo = require('socket.io')
const server = http.createServer(app)
const io = socketIo(server)
const formatMessage = require('../utils/messages')

app.get('/', (req, res) => {
  res.sendFile( __dirname + '/chat.html')
})

const socketController = (req, res) => {
  const botName = 'Chat Bot'
  io.on('connection', socket => {
    socket.emit('message', formatMessage(botName, 'Welcome to Chat!'))
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'))
    socket.on('chatMsg', (msg) => {
      console.log(msg)
      io.emit('message', formatMessage('USER', msg))
    })
    socket.on('disconnect', () => {
      io.emit('message', formatMessage(botName, 'A user has left the chat'))
    })
  })
}

server.listen(4000, () => console.log('Server is running on 4000'))

module.exports = {
  socketController
}
