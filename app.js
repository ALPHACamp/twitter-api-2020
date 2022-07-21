if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const session = require('express-session')
const cors = require('cors')
const routes = require('./routes/index')
const passport = require('./config/passport')
const helpers = require('./_helpers')

const app = express()
const port = process.env.PORT || 3000
const SESSION_KEY = 'secret'

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: SESSION_KEY, resave: false, saveUninitialized: false }))
app.use(passport.initialize())

app.use((req, res, next) => {
  res.user = helpers.getUser(req)
  next()
})

app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
