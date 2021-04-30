const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./models')
const { generateMessage } = require('./utils/message')
const { addUser, getUser, removeUser, countUsers } = require('./utils/users')

const app = express()
const http = require('http')
const socketio = require('socket.io')
const server = http.createServer(app)
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '/public')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Set up static file
app.use(express.static(publicDirectoryPath))

// test
const db = require('./models')
const Message = db.Message

// Set up socket.io
global.io = socketio(server)
global.io.on('connection', socket => {
  // console.log('socket', socket)
  // join
  socket.on('join', async ({ username, roomId, userId }) => {
    const user = await addUser({
      socketId: socket.id,
      roomId,
      userId,
      username
    })
    socket.join(user.roomId)

    // count users
    const userCount = countUsers(user.roomId)
    io.to(user.roomId).emit('users count', userCount)

    // welcome the user when joining
    // socket.emit('message', generateMessage('Welcome!'))

    // notify everyone except the user
    socket.broadcast
      .to(user.roomId)
      .emit('message', generateMessage(`${username} 上線`))
  })

  socket.on('chat message', async (msg, callback) => {
    const user = getUser(socket.id)
    // 要在這裡 create 還是在 roomController 裡面？
    await Message.create({
      UserId: user.userId,
      ChatRoomId: user.roomId,
      message: msg
    })
    io.to(user.roomId).emit('chat message', generateMessage(msg))

    // Event Acknowledgement
    callback()
  })

  socket.on('disconnect', async () => {
    const user = await removeUser(socket.id)

    if (user) {
      // count users
      const userCount = countUsers(user.roomId)
      io.to(user.roomId).emit('users count', userCount)

      io.to(user.roomId).emit(
        'message',
        generateMessage(`${user.username} 離線`)
      )
    }
  })
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

app.use((error, req, res, next) => {
  console.error(error.stack)
  res.status(500).json({
    status: 'error',
    message: 'Something broke!'
  })
})

module.exports = app
