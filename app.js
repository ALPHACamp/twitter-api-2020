if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const { apis } = require('./routes')
const port = process.env.PORT || 3000
const session = require('express-session')
const passport = require('./config/passport')
const SESSION_SECRET = 'secret'
const { getUser } = require('./helpers/auth-helpers')

app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Express v4.16 以後的版本已內建 body-parser
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize()) // 增加這行，初始化 Passport
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})
app.use('/api', apis)
app.listen(port, () => console.log(`App is listening on port ${port}!`))

module.exports = app
