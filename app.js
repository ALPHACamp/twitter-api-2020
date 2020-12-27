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
app.use(cors());
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

app.get('/chatroom', (req, res) => {
  res.render('index')
})

const server = require('http').Server(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})
let onlineCount = 0

io.on('connection', socket => {
  console.log('user connected...');
  console.log('socket', socket.id)
  onlineCount++

  io.emit('online', onlineCount)

  socket.on('send message', (msg) => {
    socket.broadcast.emit('msg', msg)
    socket.emit('selfmsg', msg)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
    onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1
    io.emit('online', onlineCount)
    io.sockets.emit('exit', onlineCount + ' user leave');
  })

  socket.on('chatting', (user) => {
    const USERID = user.id
    User.findByPk(USERID)
      .then(user => {
        Chat.findOne({ where: { UserId: USERID } })
          .then(chat => {
            if (!chat) {
              Chat.create({
                UserId: USERID
              })
            } else {
              console.log('使用者已經在線上')
            }
          })
      })
    socket.broadcast.emit('newclientlogin', `${user.name} 上線`)
  })
})

server.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))

require('./routes')(app)

module.exports = app