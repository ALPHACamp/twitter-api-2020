const express = require('express')
const session = require('express-session')
const methodOverride = require('method-override')
const helpers = require('./_helpers')

const passport = require('./config/passport')
const routes = require('./routes')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: 'devSecretIsVeryMystery', resave: false, saveUninitialized: false }))
app.use(methodOverride('_method'))
app.use(passport.initialize())

app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
