if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')
const express = require('express')
const passport = require('./config/passport')
const session = require('express-session')
const helpers = require('./_helpers')

const { apis } = require('./routes')

const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

const SESSION_SECRET = 'secret'

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use((req, res, next) => {
  res.user = helpers.getUser(req)
  next()
})

app.use('/api', apis)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
