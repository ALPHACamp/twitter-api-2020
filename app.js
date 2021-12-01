if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const helpers = require('./_helpers')
const app = express()
const port = 3000
const passport = require('./config/passport')

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
}

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// setup passport
app.use(passport.initialize())

app.listen(port, () =>
  console.log(`SimpleTwitter app listening on port ${port}!`)
)

require('./routes')(app, passport)
module.exports = app
