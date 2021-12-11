if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const routes = require('./routes')
const cors = require('cors')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8084", "http://localhost:8080"],
    methods: ["GET", "POST"],
    credentials: true
  }
})
const PORT = process.env.PORT
const { socketAuth } = require('./middlewares/auth')
const createRoomName = require('./helpers/utils')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const { Message } = require('./models')
const userList = []

io.use(socketAuth).on('connection', (socket) => {
  console.log(socket.user)
  // 取得當前使用者資訊
  const currentUser = socket.user

  // 取得上線者資料
  const checkUser = userList.find(user => user.id === currentUser.id)
  if (!checkUser) {
    userList.push(socket.user)
  }
  console.log(userList)
  io.emit('loginStatus', `${currentUser.name}已經登入了`)
  io.emit('loginUser', userList)

  // 加入特定頻道(public or private)
  socket.on('joinRoom', async (data) => {
    if (data.roomName === 'public') {
      console.log(`${currentUser.name} has join public Room`)
      socket.join('public')
    } else {
      const userId = Number(data.id.id) // 其他使用者id
      const roomName = createRoomName(userId, currentUser.id)
      socket.join(roomName)
      console.log(`${currentUser.name} has join ${roomName} Room`)
    }
    // socket.emit('messageNotRead', unread)
  })

  // 離開特定頻道(public or private)
  socket.on('leaveRoom', (data) => {
    if (data.roomName === 'public') {
      console.log(`${currentUser.name} has left public Room`)
      socket.leave('public')
    } else {
      const userId = Number(data.id.id)
      const roomName = createRoomName(userId, currentUser.id)
      console.log(`${currentUser.name} has left ${roomName} Room`)
      socket.join(roomName)
    }
  })

  // 傳送訊息
  socket.on('sendMessage', async (data) => {
    // 輸入空白訊息，不動作
    if (data.text.trim() === '') {
      return
    }

    // 根據公開頻道或是私人頻道做相應處理
    if (data.roomName === 'public') {
      const message = await postMessage(data, currentUser.id)
      message.avatar = currentUser.avatar
      io.to(message.roomName).emit('message', message)
    } else {
      const userId = Number(data.id.id) // 其他使用者id
      const roomName = createRoomName(userId, currentUser.id)
      data.roomName = roomName
      const message = await postMessage(data, currentUser.id)
      message.avatar = currentUser.avatar
      io.to(message.roomName).emit('message', message)
    }
  })

  // 使用者離線
  socket.on('disconnect', async () => {
    console.log('The user disconnected')
    const index = userList.findIndex(user => user.id === currentUser.id)
    userList.splice(index, 1)
    io.emit('loginStatus', `${currentUser.name}已經登出了`)
    io.emit('loginUser', userList)
  })
})

app.use(routes)

httpServer.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app