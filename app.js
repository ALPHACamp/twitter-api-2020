const express = require('express')
const session = require('express-session')
const helpers = require('./_helpers');

const app = express()
const port = process.env.PORT || 3000

const passport = require('./config/passport')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())

app.use((req, res, next) => {
  req.user = helpers.getUser(req)
  next()
})
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

require('./routes')(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
