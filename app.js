if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')

const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

// cors 的預設為全開放
app.use(cors())

// 即時互動(即時聊天 polling)，建立通道 server + 引入 socket.io
const http = require('http')
const server = http.createServer(app)
const socketIO = require('socket.io')

const db = require('./models')
const User = db.User
const Room = db.Room
const Message = db.Message

const io = socketIO(server, {
  cors: {
    origin: '*'
  }
})

// 目前在線上的使用者資訊與其id
let onlineUsers = []
let onlineUsersId = []

io.on('connection', socket => {
  // io.sockets.emit('broadcast_msg', {
  //   type: 'enter',
  //   inputText: `${user}加入聊天室`
  // }
  // )
  socket.on('enter_chat', (data) => {
    io.sockets.emit('broadcast_msg', {
      type: 'enter',
      inputText: `${data.user.name} 進入聊天室`
    })
 
    // 檢查目前新連線的使用者，是否已經在 onlineUsers 中，若否則新加入。最後將 onlineUsers 傳給所有使用者，更新前端的上線使用者列表畫面
    if (!onlineUsersId.includes(data.user.id)) {
      onlineUsersId.push(data.user.id)
      let newUser = { ...data.user }
      onlineUsers.push(newUser)
    }

    io.sockets.emit('update_users', onlineUsers)

    User.findByPk(data.user.id)
    .then(user => {
      user.update({
        socketId: socket.id
      })
      .then(() => {
        io.sockets.to(socket.id).emit('get_socket_id', socket.id)
      })
    })
  })

  socket.on('historical_messages', async (data) => {
    try {
      Message.findAll({ include: [User], order: [['createdAt', 'ASC']] })
        .then(messages => {
          messages = { messages: messages }
          messages = JSON.stringify(messages)
          messages = JSON.parse(messages)
          messages = messages.messages.map(message => ({
            id: message.id,
            UserId: message.UserId,
            RoomId: message.RoomId,
            text: message.text,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            User: {
              id: message.User.id,
              name: message.User.name,
              avatar: message.User.avatar
            }
          }))
          return messages
        })
        .then(messages => {
          io.sockets.to(socket.id).emit('historical_messages', messages)
        })
    } catch (error) {
      console.warn(error)
    }
  })

  socket.on('send_msg', (data) => {
    let time = new Date()
    let RoomId = 1
    Message.create({
      UserId: data.user.id,
      text: data.inputText,
      RoomId: RoomId,
      createdAt: time
    })

    io.sockets.emit('broadcast_msg', {
      type: 'message',
      inputText: data.inputText,
      time: time.toLocaleString(),
      user: {
        id: data.user.id,
        name: data.user.name,
        avatar: data.user.avatar
      }
    })
  })

  socket.on('remove_user', (data) => {
    // 更新 onlineUsers、onlineUsers，並將更新後的 onlineUsers 傳給所有使用者，更新前端的上線使用者列表畫面
    let tempOnlineUsersId = []
    let tempOnlineUsers = []
    onlineUsersId.forEach(onlineUserId => {
      if (onlineUserId !== data.user.id) {
        tempOnlineUsersId.push(onlineUserId)
      }
    })
    onlineUsersId = tempOnlineUsersId

    onlineUsers.forEach(onlineUser => {
      if (onlineUsersId.includes(onlineUser.id)) {
        tempOnlineUsers.push(onlineUser)
      }
    })
    onlineUsers = tempOnlineUsers

    io.sockets.emit('broadcast_msg', {
      type: 'leave',
      inputText: `${data.user.name}離開聊天室`,
    })
    io.sockets.emit('update_users', onlineUsers)
  })

  socket.on('disconnect', () => {
    return
  })



  socket.on('send_private_msg', (data) => {
    if (data.user1 && data.user2) {
      io.sockets.to(data.user1).to(data.user2).emit('broadcast_msg', {
        type: 'enter',
        inputText: `send_private_msg`
      })
    } else {
      io.sockets.to(socket.id).emit('broadcast_msg', {
        type: 'enter',
        inputText: `${socket.id}`
      })
    }
  })
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// module.exports = app

server.listen(3030, () => {
  console.log('listening on *:3030')
})

const router = require('./routes')
router(app)
module.exports = app
