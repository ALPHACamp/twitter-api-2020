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
// io.use(
//   (socket, next) => {
//     const token = socket.handshake.auth.token
//     if (socket.handshake.query && socket.handshake.query.token) {
//       jwt.verify(
//         token,
//         process.env.JWT_SECRET,
//         (err, decoded) => {
//           if (err) return next(new Error('Authentication error'))
//           socket.userId = decoded.id
//           console.log('socket.userId', socket.userId)
//           next()
//         })
//     } else {
//       next(new Error('Authentication error'))
//     }
//   }
// )
io.on('connection', socket => {
  console.log('connection')
  socket.on('createdUserId', function (userId) {
    console.log('userId==================================', userId)
  })
  socket.on('online', userId => {
    User.findByPk(userId, {
      include: [id, avatar, account, name]
    }).then(user => {
      user = user.toJSON()
    })
    if (!user) return
    socket.user = user
    user.socketId = [socket.id]
    // 線上使用者列表加入新使用者的資料
    if (activeUsers.map(u => u.id).includes(user.id)) {
      console.log('This user exited.')
    } else {
      activeUsers.push(user)
      activeUsersCount++
      console.log(activeUsersCount)
    }
    console.log(activeUsers)
    // 發送線上使用者列表//發送上線人數
    io.emit('activeUsers', activeUsersCount, activeUsersCount)
    // 向聊天室廣播新的使用者上線
    const data = {
      online: user
    }
    io.emit('notification', data)
  })
  /*socket.on('disconnect', (userId) => {
    // emit使用者離線通知
    if (!userId) { return }
    // 線上使用者列表移除離線使用者資料
    const activeUsersIndex = activeUsers.map(u => u.id).indexOf(userId)
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
  })*/

  // api發送歷史訊息(avatar id account name messages)
  // on監聽使用者發送的訊息//儲存訊息到db//emit發送使用者的訊息到聊天室
  socket.on('sendMessage', async (data) => {
    // console.log(data)
    // console.log(data["message"])
    try {
      if (data) {
        const createdMessage = await Message.create({
          content: data["message"],
          UserId: data["userId"],
          createdAt: Date.now()
        })
        //撈使用者
        const user = await User.findByPk(data["userId"], { raw: true, nest: true, attributes: { exclude: ['email', 'password', 'introduction', 'cover', 'role'] } })

        // console.log(createdMessage.toJSON())
        // console.log(user)

        //傳送使用者和訊息
        io.emit('newMessage', { message: createdMessage.toJSON(), user })
      }
    }
    catch (err) { console.log(err) }
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
