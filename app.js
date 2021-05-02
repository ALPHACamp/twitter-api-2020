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
  getOtherUser,
  updateTime,
  saveData
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
    methods: ['GET', 'POST', 'DELETE'],
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

    let rooms = []
    if (!data.rooms) {
      const authors = await getAuthors(userId)

      console.log('authors - start session', authors)

      if (authors) {
        rooms = authors.map(account => {
          socket.join(`# ${account}`)
          return `# ${account}`
        })
      }
      console.log('socket.rooms1111', socket.rooms)

      rooms.push(`self ${userId}`)

      console.log('rooms1111', rooms)
    } else {
      rooms = data.rooms
      rooms.forEach(room => {
        socket.join(room)
      })

      console.log('socket.rooms2222', socket.rooms)

      console.log('rooms2222', rooms)
    }

    socket.emit('set session', { rooms })
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
    let rooms = data.rooms
    console.log('rooms1 - cancel subscription', rooms)

    rooms ? rooms.push(`# ${account}`) : (rooms = [`# ${account}`])

    console.log('rooms2 - cancel subscription', rooms)

    socket.emit('set session', { rooms })
  })

  // notification
  socket.on('notification', async ({ userId, tweetId, tweet }) => {
    console.log('info - notification', { userId, tweetId, tweet })
    const user = await getUserInfo(userId)
    console.log('user - notification', user)
    if (user) {
      socket.broadcast
        .to(`# ${user.account}`)
        .emit('notification', { ...user, tweet, tweetId, type: 1 })
    }
  })

  // Tweet
  socket.on('tweet', async (data, currentUserId) => {
    await saveData({
      id: data.id,
      tweetId: data.tweetId,
      currentUserId,
      type: 1
    })
  })

  // like
  socket.on('like', async data => {
    console.log('===== receive like event =====')
    console.log('data.userId - like', data.userId)
    await saveData({
      id: data.currentUserId,
      currentUserId: data.userId,
      type: 4
    })
    const user = await getUserInfo(data.currentUserId)

    console.log('user - like', user)

    socket.broadcast
      .to(`self ${data.userId}`)
      .emit('notification', { ...user, type: 4 })
  })

  // follow
  socket.on('follow', async data => {
    console.log('===== receive follow event =====')
    console.log('data.userId - follow', data.userId)

    await saveData({
      id: data.currentUserId,
      currentUserId: data.userId,
      type: 2
    })

    const user = await getUserInfo(data.currentUserId)

    console.log('user - follow', user)

    socket.broadcast
      .to(`self ${data.userId}`)
      .emit('notification', { ...user, type: 4 })
  })

  // reply
  socket.on('reply', async data => {
    console.log('===== receive reply event =====')
    console.log('data.userId - reply', data.userId)

    await saveData({
      id: data.currentUserId,
      currentUserId: data.userId,
      replyId: data.replyId,
      type: 3
    })

    const user = await getUserInfo(data.currentUserId)

    console.log('user - reply', user)

    socket.broadcast.to(`self ${data.userId}`).emit('notification', {
      ...user,
      replyId: data.replyId,
      reply: data.reply,
      type: 3
    })
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
    await updateTime(userId, roomId)

    console.log('socket.rooms - join', socket.rooms)

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
      message: msg.message
    })
    io.to(user.roomId).emit(
      'chat message',
      generateMessage(msg.message, user.userId, user.avatar)
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
      UserId: msg.userId,
      ChatRoomId: msg.roomId,
      message: msg.message
    })
    console.log('msg.roomId - private chat message', msg.roomId)
    io.to(msg.roomId).emit(
      'private chat message',
      generateMessage(msg.message, msg.userId, user.avatar)
    )

    const otherUser = await getOtherUser(msg.userId, msg.roomId)
    console.log('otherUser', otherUser)

    socket.broadcast.to(`self ${otherUser}`).emit('notice from private', 1)

    // notify another user
    if (msg.newMessage) {
      console.log('newwwwwww')
      socket.broadcast
        .to(`self ${otherUser}`)
        .emit(
          'new private chat message',
          generateMessage(msg.message, msg.userId, user.avatar),
          msg.roomId
        )
      console.log('done!', msg.roomId)
    }

    // Event Acknowledgement
    callback()
  })

  // user switch to other private room
  socket.on('leave', async (userId, roomId) => {
    console.log('leaveeeeeeee!', roomId)
    if (roomId) {
      socket.leave(`${roomId}`)
      await removeUser(socket.id, roomId, userId)
    }
    console.log('socket.rooms - leave', socket.rooms)
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
