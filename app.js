const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helpers = require('./_helpers.js')
const db = require('./models')
const Chat = db.Chat

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = process.env.PORT
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

io.on('connection', (socket) => {
  console.log('a user connected', socket.id)
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
  socket.on('chat message', (msg) => {
    // console.log('message: ', { msg: msg, id: socket.id })
    // console.log(msg.data.userId)
    // console.log(msg.data.message)
    // console.log(socket.id)
    Chat.create({
      UserId: msg.data.userId,
      text: msg.data.message
    })
  })
  socket.on('chat message', (msg) => {
    io.emit('chat message', { msg: msg, id: socket.id })
  })
  socket.emit('history', (obj) => {
    Chat.findAll({ order: ['createAt', 'DESC'] })
    .then(chats =>{
      console.log(chats)
      io.emit('history', res.json(chats))
    })
  })
})

http.listen(port, () => console.log(`Socket Start. Listening on port ${port}！`))

require('./routes')(app)

module.exports = app
