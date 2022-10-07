const path = require('path')
const express = require('express')
const methodOverride = require('method-override')
const session = require('express-session')
// const { getUser } = require('./middleware/api-auth')

const passport = require('./config/passport')
const { apis } = require('./routes')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
// use helpers.getUser(req) to replace req.user
// authenticate user before enter api routes
// function authenticated (req, res, next) {
//   passport.authenticate('jwt', { session: false })
// }

app.use('/api', apis)
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app
