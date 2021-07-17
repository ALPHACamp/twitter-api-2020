const path = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const app = express()
const server = http.createServer(app)
const db = require('./models')
const { User } = db
const jwt = require('jsonwebtoken')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/upload', express.static(__dirname + '/upload'))
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

require('./routes')(app)

const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:8080', 'https://chris1085.github.io/SimpleTwitter-vue/'],
    methods: ['GET', 'POST'],
    credentials: true
  }
})
const activeUsers = new Set()
io.use(
  (socket, next) => {
    const token = socket.handshake.auth.token
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {
          if (err) return next(new Error('Authentication error'))
          socket.userId = decoded.id
          console.log('socket.userId', socket.userId)
          next()
        })
    } else {
      next(new Error('Authentication error'))
    }
  }
).on('connection', async socket => {
  console.log('connection')
  console.log('連接成功上線ID -----', socket.id)
  if (!socket.id) return
  socket.on('online', async userId => {
    try {
    // 用socket.id撈使用者資料
      const user = await User.findByPk(userId, {
        include: [id, avatar, account, name]
      })
      if (!user) return
      user = user.toJSON()
      socket.user = user
      user.socketId = [socket.id]
      // 線上使用者列表加入新使用者的資料
      activeUsers.add(user)
      // 發送線上使用者列表
      io.emit('activeUsers', [...activeUsers])
      // 向聊天室廣播新的使用者上線
      const data = {
        online: user
      }
      io.emit('message', data)
    } catch (err) {
      console.log(err)
    }
  })
  socket.on('disconnect', async (userId) => {
    try {
    // emit使用者離線通知
      if (!userId) { return }
      // 線上使用者列表移除離線使用者資料
      activeUsers.delete(socket.userId)
      // 聊天室通知該名使用者離開聊天
      const data = {
        offline: user
      }
      io.emit('message', data)
      // 發送線上使用者列表
      io.emit('activeUsers', activeUsers)
    } catch (err) {
      console.log(err)
    }
  })
})

server.listen(port, () => console.log(`Example server listening on port http://localhost:${port}`))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err
  })
})

module.exports = app
