if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const helpers = require('./_helpers')
const routes = require('./routes')
const flash = require('connect-flash')
const session = require('express-session')
// const methodOverride = require('method-override')// 不確定不需要
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')

const app = express()
const port = 3000
const SESSION_SECRET = 'secret'

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
