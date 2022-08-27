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
  // 公開聊天與私人聊天共用部分
  // 公開聊天與私人聊天共用部分
  // 公開聊天與私人聊天共用部分
  socket.on('disconnect', () => {
    return
  })

  // 公開聊天部分
  // 公開聊天部分
  // 公開聊天部分
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

    //將 onlineUsers 傳給所有使用者，更新前端的上線使用者列表畫面
    io.sockets.emit('update_users', onlineUsers)
  })

  socket.on('historical_messages', async (data) => {
    try {
      Message.findAll({ where: { RoomId: 1 }, include: [User], order: [['createdAt', 'ASC']] })
        .then(messages => {
          messages = { messages: messages }
          messages = JSON.stringify(messages)
          messages = JSON.parse(messages)
          messages = messages.messages.map(message => ({
            id: message.id,
            UserId: message.UserId,
            RoomId: message.RoomId,
            text: message.text,
            createdAt: new Date(message.createdAt).toLocaleString(),
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
        .catch(error => {
          return res.status(401).json({ status: 'error', message: 'historical_messages', error: error })
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
      .catch(error => {
        return res.status(401).json({ status: 'error', message: 'send_msg', error: error })
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

  // 私人聊天部分
  // 私人聊天部分
  // 私人聊天部分
  socket.on('enter_chat_private', (data) => {
    User.findByPk(data.user.id)
      .then(user => {
        user.update({
          socketId: socket.id
        })
          .then(() => {
            io.sockets.to(socket.id).emit('get_socket_id', socket.id)
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', message: 'enter_chat_private', error: error })
      })
  })

  socket.on('historical_messages_private', async (data) => {
    try {
      // 透過前端傳來的 2 位使用者的 id，找出對應的 room
      let user1Id = 0
      let user2Id = 0
      if (data.currentUserId > data.targetUserId) {
        user1Id = data.targetUserId
        user2Id = data.currentUserId
      } else {
        user1Id = data.currentUserId
        user2Id = data.targetUserId
      }
      Room.findOne({ where: { user1Id: user1Id, user2Id: user2Id } })
        .then(room => {
          // 透過 room id 找到歷史聊天訊息，並將聊天訊息回傳給前端
          Message.findAll({ where: { RoomId: room.id }, include: [User], order: [['createdAt', 'ASC']] })
            .then(messages => {
              messages = { messages: messages }
              messages = JSON.stringify(messages)
              messages = JSON.parse(messages)
              messages = messages.messages.map(message => ({
                id: message.id,
                UserId: message.UserId,
                RoomId: message.RoomId,
                text: message.text,
                createdAt: new Date(message.createdAt).toLocaleString(),
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

        })
        .catch(error => {
          return res.status(401).json({ status: 'error', message: 'historical_messages_private', error: error })
        })
    } catch (error) {
      console.warn(error)
    }
  })

  socket.on('send_private_msg', (data) => {
    let time = new Date()
    // 透過前端傳來的 2 位使用者的 id，找出對應的 room
    let user1Id = 0
    let user2Id = 0
    if (data.user1.id < data.user2.id) {
      user1Id = data.user1.id
      user2Id = data.user2.id
    } else {
      user1Id = data.user2.id
      user2Id = data.user1.id
    }
    Room.findOne({ where: { user1Id: user1Id, user2Id: user2Id } })
      .then(room => {
        // 儲存該筆聊天訊息到資料庫，並將聊天訊息回傳給前端私聊的 2 位使用者
        let RoomId = room.id
        Message.create({
          UserId: data.user1.id,
          text: data.inputText,
          RoomId: RoomId,
          createdAt: time
        })
          .then(() => {
            User.findByPk(data.user2.id)
              .then(user => {
                io.sockets.to(socket.id).to(user.socketId).emit('broadcast_msg_private', {
                  type: 'message',
                  senderId: data.user1.id,
                  inputText: data.inputText,
                  time: time.toLocaleString(),
                  // 建立聊天訊息頭像的所需資料
                  user: {
                    id: data.user1.id,
                    name: data.user1.name,
                    avatar: data.user1.avatar
                  }
                })
              })
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', message: 'send_private_msg', error: error })
      })
  })

  // test部分
  // test部分
  // test部分
  socket.on('test_historical_messages_private', async (data) => {
    try {
      // 透過前端傳來的 2 位使用者的 id，找出對應的 room
      let user1Id = 0
      let user2Id = 0
      if (data.currentUserId > data.targetUserId) {
        user1Id = data.targetUserId
        user2Id = data.currentUserId
      } else {
        user1Id = data.currentUserId
        user2Id = data.targetUserId
      }
      Room.findOne({ where: { user1Id: user1Id, user2Id: user2Id } })
        .then(room => {
          // 透過 room id 建立聊天室，並把 2 位使用者加到聊天室中
          User.findByPk(data.currentUserId)
            .then(currentUser => {
              User.findByPk(data.targetUserId)
                .then(targetUser => {
                  io.in(currentUser.socketId).in(targetUser.socketId).socketsJoin(`room${room.id}`)
                })
                .then(() => {
                  // 透過 room id 找到歷史聊天訊息，並將聊天訊息回傳給前端
                  Message.findAll({ where: { RoomId: room.id }, include: [User], order: [['createdAt', 'ASC']] })
                    .then(messages => {
                      messages = { messages: messages }
                      messages = JSON.stringify(messages)
                      messages = JSON.parse(messages)
                      messages = messages.messages.map(message => ({
                        id: message.id,
                        UserId: message.UserId,
                        RoomId: message.RoomId,
                        text: message.text,
                        createdAt: new Date(message.createdAt).toLocaleString(),
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
                      io.sockets.to(`room${room.id}`).emit('historical_messages', messages)
                    })
                })
            })
        })
        .catch(error => {
          console.warn('error', error)
        })
    } catch (error) {
      console.warn(error)
    }
  })

  socket.on('test_send_private_msg', (data) => {
    let time = new Date()
    // 透過前端傳來的 2 位使用者的 id，找出對應的 room
    let user1Id = 0
    let user2Id = 0
    if (data.user1.id < data.user2.id) {
      user1Id = data.user1.id
      user2Id = data.user2.id
    } else {
      user1Id = data.user2.id
      user2Id = data.user1.id
    }
    Room.findOne({ where: { user1Id: user1Id, user2Id: user2Id } })
      .then(room => {
        // 儲存該筆聊天訊息到資料庫，並將聊天訊息回傳給前端私聊的 2 位使用者
        let RoomId = room.id
        Message.create({
          UserId: data.user1.id,
          text: data.inputText,
          RoomId: RoomId,
          createdAt: time
        })
          .then(() => {
            io.sockets.to(`room${room.id}`).emit('broadcast_msg_private', {
              type: 'message',
              RoomId: RoomId,
              senderId: data.user1.id,
              inputText: data.inputText,
              time: time.toLocaleString(),
              // 建立聊天訊息頭像的所需資料
              user: {
                id: data.user1.id,
                name: data.user1.name,
                avatar: data.user1.avatar
              }
            })
          })
      })
      .catch(error => {
        console.warn('error', error)
      })
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
