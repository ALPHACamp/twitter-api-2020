if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const passport = require('./config/passport.js')
const bodyParser = require('body-parser')
const session = require('express-session')
const methodOverride = require('method-override')

const router = require('./routes')
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use(router)
app.use(function (err, req, res, next) {
  console.error(err.stack)
  return res.status(500).json({ status: 'error', message: `${err.stack}` })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
