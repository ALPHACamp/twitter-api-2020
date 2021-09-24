const express = require('express')
const cors = require('cors')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
const PORT = process.env.PORT || 3000

const passport = require('./config/passport')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(cors())

// socket
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
  // 一連線後的廣播
  // socket.emit('hi everyone')
  io.emit('welcome message', `welcome to this room`)
  console.log('a user connected')
  
  // 接收 client 端
  socket.on('giveServer', function (message) {
    console.log(message)
  })
  // 監聽
  socket.on('chat message', (msg) => {
    // 廣播收到的訊息給大家
    io.emit('chat message', msg)
    console.log('message: ' + msg)
  })
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

app.get('/', (req, res) => res.send('Hello World!'))
server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

require('./routes')(app)

module.exports = app
