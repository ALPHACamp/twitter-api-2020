const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const helpers = require('./_helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const session = require('express-session')
const passport = require('./config/passport')
const flash = require('connect-flash')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

// cors 的預設為全開放
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(bodyParser.urlencoded({ extended: true }))  // setup bodyParser
// app.use(bodyParser.json())
app.use(methodOverride('_method'))
// setup session and flash
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use('/upload', express.static(__dirname + '/upload'))
// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app)  // 把 passport 傳入 routes

module.exports = app
