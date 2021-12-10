if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const helpers = require('./_helpers')
const cors = require('cors')
const db = require('./models')

const app = express()
const port = process.env.PORT

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use(methodOverride('_method'))

app.use('/upload', express.static(__dirname + '/upload'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
  )
  next()
})

app.get('/', (req, res) => res.send('Hello World!'))
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

// 加入 socket.io 監聽
const server = require('http').Server(app).listen(port, () => {
  console.log(`The app is listening on port ${port}`)
})
const io = require('socket.io')(server)
io.on('connection', socket => {
  console.log('連接成功，上線ID: ', socket.id)
  //監聽並提示有人上線了
  socket.on('onlineHint', userName => {
    socket.broadcast.emit('onlineHint', userName)
  })

  // 監聽訊息
  socket.on('getMessage', data => {
    console.log('服務端 接收 訊息: ', data)
    // Message.create({
    //   content: data.text,
    //   UserId: data.UserId
    // }).then(message => {
    //   Message.findByPk(message.id, {
    //     include: [User]
    //   }).then(message => {
    //     //回傳 message 給所有客戶端(包含自己)
    //     io.sockets.emit('getMessage', message)
    //   })
    // })
  })

  //監聽並提示有人下線了
  socket.on('offlineHint', userName => {
    socket.broadcast.emit('offlineHint', userName)
  })

  // 連接斷開
  socket.on('disconnect', () => {
    console.log('有人離開了！， 下線ID: ', socket.id)
  })
})

module.exports = app
