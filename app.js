const path = require('path')
const express = require('express')
const methodOverride = require('method-override')
const session = require('express-session')

// const { getUser } = require('./_helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('./config/passport')
const { apis } = require('./routes')
const app = express()
const PORT = process.env.PORT

app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
// use helpers.getUser(req) to replace req.user
// function authenticated (req, res, next) {
//   // passport.authenticate('jwt', { ses...
// };

app.use('/api', apis)
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app
