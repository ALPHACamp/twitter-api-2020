const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const helpers = require('./_helpers')
if (process.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
const port = 3000

//bodyparse set
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//
app.use(session({ secret: 'twitter', saveUninitialized: true, resave: false }))
const passport = require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())
// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
}
// app.use((req, res, next) => {
//   req.user = helpers.getUser(req)
//   next()
// })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app

require('./routes/index')(app)
