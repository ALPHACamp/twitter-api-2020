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
    origin: ['http://localhost:8080', 'https://chris1085.github.io/SimpleTwitter-vue/#/signin'],
    methods: ['GET', 'POST'],
    credentials: true
  }
})

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
  // emit發送歷史訊息(avatar id account name messages)
  // emit使用者上線通知 //emit 所有上線使用者的資訊(avatar id account name)
  // on監聽使用者發送的訊息//儲存訊息到db//emit發送使用者的訊息到聊天室
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
