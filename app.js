if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
// const helpers = require('./_helpers')
const routes = require('./routes')
const methodOverride = require('method-override')
const passport = require('./config/passport')

const app = express()
const port = 3000

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// routes
app.use(routes)

// start
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
