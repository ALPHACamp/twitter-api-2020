if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const passport = require('./config/passport')
const session = require('express-session')

const { apis } = require('./routes')
const cors = require('cors')

const app = express()
const port = 3000

const SESSION_SECRET = 'secret'

app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.user = getUser(req)
  next()
})

app.use('/api', apis)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
