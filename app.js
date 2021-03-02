if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const helpers = require('./_helpers')
const routes = require('./routes')
const bodyParser = require('body-parser')
const passport = require('./config/passport')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(passport.initialize())
// routes
app.use('/', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
