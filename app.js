const express = require('express')
const session = require('express-session')
const routes = require('./routes')
const passport = require('./config/passport')
const { getUser } = require('./_helpers')

if (!process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(routes)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
