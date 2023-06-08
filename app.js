if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const session = require('express-session')
const SESSION_SECRET = 'secret'
const passport = require('./config/passport')
const methodOverride = require('method-override')
const routes = require('./routes')
const passport = require('./config/passport')
const flash = require('connect-flash')
const session = require('express-session')
const SESSION_SECRET = 'secret'
const methodOverride = require('method-override')

const app = express()
const port = 3000

app.use(express.urlencoded({ extened: true }))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
