const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
// add Model
const db = require('./models')
const { User, Message } = db

const app = express()
const server = http.createServer(app)
const jwt = require('jsonwebtoken')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/upload', express.static(__dirname + '/upload'))
// swagger
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

require('./routes')(app)

const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:8080', 'https://chris1085.github.io/SimpleTwitter-vue/'],
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
})
const activeUsers = []
const activeUsersCount = 0
io.use(async (socket, next) => {
  const token = socket.handshake.query.token
  if (!token) return
  if (socket.handshake.query && token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      try {
        if (err) return next(new Error('Authentication error'))
        socket.decoded = decoded
        socket.userId = decoded.id
        next()
      } catch (err) {
        console.log(err)
      }
    })
    next()
  } else {
    next(new Error('Authentication error'))
  }
}).on('connection', async socket => {
  try {
    console.log('connection', socket.userId)
    const user = await User.findByPk(socket.userId, {
      attributes: ['id', 'name', 'account', 'avatar', 'role']
    })

    if (user) {
      socket.userId = user.dataValues.id
      socket.user = user.dataValues
      socket.user.socketId = socket.id
      console.log('socket.userId', user.dataValues.id)
      console.log('socket.user', user.dataValues)
      console.log('socket.user.socketId', socket.id)
    }
    socket.on('online', async () => {
      try {
      // 線上使用者列表加入新使用者的資料
        const user = socket.user
        if (activeUsers.map(u => u.id).includes(user.id)) {
          console.log('This user already exited.')
        } else {
          activeUsers.push(user)
          activeUsersCount++
          console.log(activeUsersCount)
        }
        console.log(activeUsers)
        // 發送線上使用者列表//發送上線人數
        io.emit('activeUsers', activeUsersCount, activeUsersCount)
        // 向聊天室廣播新的使用者上線
        const data = { online: user }
        io.emit('notification', data)
      } catch (err) {
        console.log(err)
      }
    })
    socket.on('disconnect', async () => {
    // emit使用者離線通知
      if (!socket.user) { return }
      console.log('disconnect', socket.user)
      const user = socket.user
      // 線上使用者列表移除離線使用者資料
      const activeUsersIndex = activeUsers.map(u => u.id).indexOf(user.id)
      activeUsers.splice(activeUsersIndex, 1)
      console.log(activeUsers)
      console.log(activeUsersCount)
      // 聊天室通知該名使用者離開聊天

      const data = {
        offline: user
      }
      io.emit('notification', data)
      // 發送線上使用者列表
      io.emit('activeUsers', activeUsers, activeUsersCount)
    })
    // api發送歷史訊息(avatar id account name messages)
    // on監聽使用者發送的訊息//儲存訊息到db//emit發送使用者的訊息到聊天室
    socket.on('sendMessage', async (message) => {
      console.log('sendMessage socket.user', socket.user)
      console.log('message', message)
      try {
        if (message) {
          const createMessage = await Message.create({
            content: message,
            UserId: message.id,
            createdAt: Date.now()
          })
          const { createdAt } = createMessage
          // 撈使用者
          const user = await User.findByPk(message.id)
          const { id, name, avatar, account } = user
          // 傳送使用者和訊息
          socket.emit('newMessage', { message, createdAt, id, name, avatar, account })
        }
      } catch (err) { console.log(err) }
    })
  } catch (err) {
    console.log(err)
  }
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
