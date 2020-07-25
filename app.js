const express = require('express')
const helpers = require('./_helpers')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
const passport = require('./config/passport')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  next()
})

module.exports = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)
