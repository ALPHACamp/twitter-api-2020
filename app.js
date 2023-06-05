if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const { getUser } = require('./_helpers')
const passport = require('./config/passport')
const session = require('express-session')
const flash = require('connect-flash')
const { apis } = require('./routes')

const app = express()
const port = 3000

// 解析request主體
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// session設定
app.use(session({
  secret: process.env.SESSION_SECRET || 'NonSecret',
  resave: false,
  saveUninitialized: true
}))

// passport初始化
app.use(passport.initialize())
app.use(passport.session())

// flash
app.use(flash())

// // locals
app.use((req, res, next) => {
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

// routes
app.use('/apis', apis)

app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`))

module.exports = app
