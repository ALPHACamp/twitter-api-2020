if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
} //放在最前面好安心
const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
//登入認證
const session = require('express-session')
const methodOverride = require('method-override')
const helpers = require('./_helpers')
const passport = require('./config/passport')
const app = express()
const port = process.env.PORT || 3000
const route = require('./routes')
const SESSION_SECRET = 'ThisIsMySecret'

// body-parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // POST json格式
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})
app.use(passport.initialize())
app.use(passport.session())

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};



app.use(methodOverride('_method'))
app.use(route)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))



module.exports = app
