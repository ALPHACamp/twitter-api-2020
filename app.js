if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const { helpers, getUser } = require('./_helpers')
const session = require('express-session')
const passport = require('./config/passport')
const { apis } = require('./routes')

const app = express()
const port = process.env.PORT || 3000

const SESSION_SECRET = 'secret'

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api', apis)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
