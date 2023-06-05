if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// const path = require('path')
const express = require('express')
const routes = require('./routes')
// const helpers = require('./_helpers')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const SESSION_SECRET = 'secret'

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
// app.use('/upload', express.static(path.join(__dirname, 'upload')))
// use helpers.getUser(req) to replace req.user
// function authenticated (req, res, next) {
//   // passport.authenticate('jwt', { ses...
// };
app.use('/api', routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
