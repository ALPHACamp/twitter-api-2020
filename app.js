const express = require('express')
const session = require('express-session')
const helpers = require('./_helpers');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
// Create http server for socket.io
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})
const passport = require('./config/passport')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())

app.use((req, res, next) => {
  req.user = helpers.getUser(req)
  next()
})
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
server.listen(4040, () => {
  console.log(`socketio server listening on port 4040!`)
})

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/view/index.html')
})

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
})
io.on('connection', (socket) => {
  console.log('Hello world')
  socket.on('chat message', (msg) => {
    // broadcasting to all connected sockets
    io.emit('chat message', msg)
    console.log('message: ' + msg)
  })
  socket.on('disconnect', () => {
    console.log('Bye')
  })
})

require('./routes')(app)

module.exports = app
