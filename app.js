if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
<<<<<<< HEAD
// require module
const methodOverride = require('method-override')
const session = require('express-session')
const express = require('express')
=======
const express = require('express')
const session = require('express-session')
const passport = require('./config/passport')
>>>>>>> master

// require self-made module
const passport = require('./config/passport')
const { apis } = require('./routes')

// app setting
const app = express()
const port = process.env.PORT || 3000
<<<<<<< HEAD
=======
const { apis } = require('./routes')
>>>>>>> master
app.use(express.urlencoded({ extended: true }))// req.body
app.use(methodOverride('_method'))
app.use(express.json())// json

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  req.session.messages = [] // 重設錯誤訊息
  next()
})


app.use('/api', apis)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
