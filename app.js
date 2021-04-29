const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./models')
const { generateMessage } = require('./utils/message')
const { addUser, getUser } = require('./utils/users')

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

// Set up socket.io
global.io = socketio(server)
global.io.on('connection', socket => {
  // console.log('socket', socket)
  // join
  socket.on('join', async ({ username, roomId, userId }) => {
    const user = await addUser({ socketId: socket.id, roomId, userId })
    socket.join(user.roomId)

    // welcome the user when joining
    // socket.emit('message', generateMessage('Welcome!'))

    // notify everyone except the user
    socket.broadcast
      .to(user.roomId)
      .emit('message', generateMessage(`${username} 上線`))
  })

  socket.on('chat message', (msg, callback) => {
    const user = getUser(socket.id)
    io.to(user.roomId).emit('chat message', generateMessage(msg))

    // Event Acknowledgement
    callback()
  })

  socket.on('disconnect', () => {
    io.to().emit('message', generateMessage(`${username} 離線`))
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
