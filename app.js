if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const path = require('path')
const express = require('express')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

const routes = require('./routes')
const passport = require('./config/passport')

const { getUser } = require('./_helpers')

const methodOverride = require('method-override')
const session = require('express-session')
const cors = require('cors')

// Setting Cors
app.use(cors())

// Setting body-parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
)

// Setting passport
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.user = getUser(req)
  next()
})

// Setting middleware
app.use(methodOverride('_method'))

// Setting upload path
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
