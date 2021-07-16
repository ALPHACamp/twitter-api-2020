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
app.use(express.static(path.join(__dirname, 'public')))

app.use('/upload', express.static(__dirname + '/upload'))
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.get('/users/chat', (req, res) => {
  res.sendFile(__dirname + '/public/publicRoom.html')
})

require('./routes')(app)

const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://chris1085.github.io/SimpleTwitter-vue/#/signin'],
    methods: ['GET', 'POST'],
    credentials: true
  }
})
const activeUsers = new Set()
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
io.on('connection', async socket => {
  console.log('connection')
  console.log('連接成功上線ID -----', socket.id)
  if (!socket.id) return

  // emit使用者上線通知 //emit 所有上線使用者的資訊(avatar id account name)
  socket.on('online', async data => {
    // 用socket.id撈使用者資料
    // const user = await User.findByPk(socket.id,{
    //   include: [id,avatar,account,name]
    // })
    // if (!user) return next(null, false)
    // user = data
    data = socket.id
    // 線上使用者列表加入新使用者的資料
    activeUsers.add(data)
    // 發送線上使用者列表
    io.emit('activeUsers', [...activeUsers])
    // 向聊天室廣播新的使用者上線
    socket.broadcast.emit('message', data)
  })
  socket.on('disconnect', () => {
    // emit使用者離線通知
    console.log('disconnect')
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
