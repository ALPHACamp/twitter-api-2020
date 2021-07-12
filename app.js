const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_WHITE_LIST.split(','),
    methods: ['GET', 'POST']
  }
})

const passport = require('./config/passport')
const cors = require('./config/cors')

const routes = require('./routes')

const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())

app.use(routes)

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

io.on('connection', (socket) => {
  console.log('A user connected')
  console.log(io.engine.clientsCount)
  io.emit('connection', io.engine.clientsCount)
  socket.broadcast.emit('announce', `User ${socket.id} joined the public room.`, io.engine.clientsCount)
  socket.on('chat message', (message) => {
    message = `${socket.id}: ${message}`
    io.emit('chat message', message)
  })
  socket.on('disconnect', (reason) => {
    console.log(`${socket.id} is leaving.`)
  })
})

module.exports = app
