const express = require('express')
const session = require('express-session')
const helpers = require('./_helpers');

const app = express()
const port = process.env.PORT || 3000
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

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

io.on('connection', (socket) => {
  console.log('Hello world')

  socket.on('disconnect', () => {
    console.log('Bye')
  })
})

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/view/index.html')
})

require('./routes')(app)

module.exports = app
