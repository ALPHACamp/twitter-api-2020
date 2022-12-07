if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const path = require('path')
const express = require('express')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const helpers = require('./_helpers')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

app.use(routes)

// use helpers.getUser(req) to replace req.user
// function authenticated (req, res, next) {
// passport.authenticate('jwt', { ses...
// };

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
