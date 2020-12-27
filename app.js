const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const cors = require('cors')

const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT || 3000
const passport = require('./config/passport');

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({ secret: 'itismyserect', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use('/upload', express.static(__dirname + '/upload'))

app.use((req, res, next) => {
  res.locals.success_message = req.flash('success_message')
  res.locals.error_message = req.flash('error_message')
  res.locals.user = helpers.getUser(req)
  next()
})

const db = require('./models')
const User = db.User
const Chat = db.Chat
const Message = db.Message
const helper = require('./_helpers')

app.get('/chatroom', (req, res) => {
  res.render('index')
})

app.use(cors())
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:8080', 'https://r05323045.github.io'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
})

let onlineCount = 0

io.on('connection', socket => {
  console.log('user connected...')

  onlineCount++

  socket.on('send message', (msg) => {
    const USERID = msg.id
    return Promise.all([
      Message.create({
        UserId: USERID,
        message: msg.message,
        targetChannel: '0'
      })
    ])
      .then(
        socket.broadcast.emit('msg', msg),
        socket.emit('msg', msg)
      ).catch(error => {
        console.log(error)
      })
  })

  socket.on('chatting', (user) => {
    socket.broadcast.emit('newclientlogin', { ...user, message: `${user.name} 上線` })
    User.findByPk(user.id)
      .then((user) => {
        const USERID = user.id
        return Promise.all([
          Chat.findAll({ include: [User] }),
          Chat.findOne({ where: { UserId: USERID } })
        ])
          .then(([chatters, chat]) => {
            socket.emit('userOnline', chatters)
            if (!chat) {
              Chat.create({
                UserId: USERID
              })
            } else {
              console.log('使用者已經在線上')
            }
          }).catch((err) => {
            console.log(err)
          })
      })
  })

  socket.on('leave', (id) => {
    console.log('user disconnected')
    onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1
    io.sockets.emit('exit', onlineCount + ' user leave')
  })
})

http.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))

require('./routes')(app)

module.exports = app