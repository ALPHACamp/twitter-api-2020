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
    Chat.create({
      UserId: msg.data.userId,
      text: msg.data.message
    })
  })
  socket.on('chat message', (msg) => {
    io.emit('chat message', { msg: msg, id: socket.id })
  })
  socket.on('history', (obj) => {
    console.log('obj:', obj)
    Chat.findAll({ order: [['createdAt', 'ASC']] })
    .then(chats =>{
      console.log(toJSON(chats))
      socket.emit('history', '這裡是傳送的字串')
    })
  })
})

http.listen(port, () => console.log(`Socket Start. Listening on port ${port}！`))

require('./routes')(app)

module.exports = app
