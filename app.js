if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const path = require('path')
const express = require('express')
const passport = require('./config/passport')
const flash = require('connect-flash')
const { apis, pages } = require('./routes')
const methodOverride = require('method-override')
const session = require('express-session')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

// 解析request主體
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))

// session設定
app.use(session({
  secret: process.env.SESSION_SECRET || 'NonSecret',
  resave: false,
  saveUninitialized: true
}))

// passport初始化
app.use(passport.initialize())
// app.use(passport.session())

// flash
app.use(flash())

// cors
// const corsOptions = {
//   origin: [
//     'http://localhost',
//     'https://bluelsa.github.io/twitter-frontend-2023/'
//   ],
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//   allowedHeaders: ['Content-Type', 'Authorization']

// }
app.use(cors())

// locals
app.use((req, res, next) => {
  res.locals.error_messages = req.flash('error_messages')
  next()
})

// routes
app.use('/api', apis)
app.use('/', pages)

app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`))

module.exports = app
