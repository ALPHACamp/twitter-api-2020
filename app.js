const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./models')
const { generateMessage } = require('./utils/message')
const {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
  getAuthors,
  getUserInfo,
  getOtherUser
} = require('./utils/users')

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
global.io = socketio(server, {
  cors: {
    origin: [
      'http://localhost:8080',
      'https://ivyhungtw.github.io/simple-twitter'
    ],
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
})
global.io.on('connection', socket => {
  console.log('connected!')

  // session
  socket.on('start session', async (data, userId) => {
    // test join public room
    // socket.join('4')
    socket.join(`self ${userId}`)
    console.log('socket.rooms', socket.rooms)
    console.log('userId', userId)

    console.log('data.rooms', data.rooms)

    if (!data.rooms) {
      const authors = await getAuthors(userId)

      console.log('authors - start session', authors)

      if (authors) {
        const rooms = authors.map(account => {
          socket.join(`# ${account}`)
          return `# ${account}`
        })
        socket.emit('set session', { rooms })
      }
    } else {
      const rooms = data.rooms
      rooms.forEach(room => {
        socket.join(room)
      })
      rooms.push(`self ${userId}`)
      socket.emit('set session', { rooms })
    }
  })

  // subscription
  socket.on('subscription', (data, account) => {
    console.log('account - subscription', account)
    socket.join(`# ${account}`)
    const rooms = data.rooms
    // set session
    if (rooms) {
      rooms.push(`# ${account}`)
      socket.emit('set session', { rooms })
    } else {
      socket.emit('set session', { rooms: [`# ${account}`] })
    }
  })

  // cancel subscription
  socket.on('cancel subscription', (data, account) => {
    console.log('account - cancel subscription', account)
    socket.leave(`# ${account}`)
    const rooms = data.rooms
    const index = rooms.findIndex(room => room === `# ${account}`)
    // set session
    if (index !== -1) {
      rooms.splice(index, 1)
      socket.emit('set session', { rooms })
    } else {
      socket.emit('set session', { rooms: [`# ${account}`] })
    }
  })

  // notification
  socket.on('notification', async ({ userId, tweetId, tweet }) => {
    console.log('info - notification', { userId, tweetId, tweet })
    const user = await getUserInfo(userId)
    console.log('user - notification', user)
    if (user) {
      socket.broadcast
        .to(user.account)
        .emit('notification', { ...user, tweet, tweetId })
    }
  })

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
    const usersInRoom = await getUsersInRoom(user.roomId)
    io.to(user.roomId).emit('users count', {
      users: usersInRoom,
      userCount: usersInRoom.length
    })

    // notify everyone except the user
    socket.broadcast
      .to(user.roomId)
      .emit('message', generateMessage(`${username} 上線`))
  })

  socket.on('chat message', async (msg, callback) => {
    const user = await getUser(socket.id)
    // 要在這裡 create 還是在 roomController 裡面？
    await Message.create({
      UserId: user.userId,
      ChatRoomId: user.roomId,
      message: msg
    })
    io.to(user.roomId).emit(
      'chat message',
      generateMessage(msg, user.userId, user.avatar)
    )

    // Event Acknowledgement
    callback()
  })

  // private
  socket.on('private chat message', async (msg, callback) => {
    console.log('msg - private chat message', msg)
    const user = await getUser(socket.id)
    // 要在這裡 create 還是在 roomController 裡面？
    await Message.create({
      UserId: user.userId,
      ChatRoomId: user.roomId,
      message: msg.message
    })
    io.to(user.roomId).emit(
      'private chat message',
      generateMessage(msg.message, user.userId, user.avatar)
    )

    const otherUser = await getOtherUser(user.userId, user.roomId)
    console.log('otherUser', otherUser)

    socket.broadcast.to(`self ${otherUser}`).emit('notice from private', 1)

    // notify another user
    if (msg.newMessage) {
      console.log('newwwwwww')
      socket.broadcast
        .to(`self ${otherUser}`)
        .emit(
          'new private chat message',
          generateMessage(msg.message, user.userId, user.avatar)
        )
      console.log('done!')
    }

    // Event Acknowledgement
    callback()
  })

  socket.on('disconnect', async () => {
    const user = await removeUser(socket.id)

    if (user) {
      // count users
      const usersInRoom = await getUsersInRoom(user.roomId)
      io.to(user.roomId).emit('users count', {
        users: usersInRoom,
        userCount: usersInRoom.length
      })

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
