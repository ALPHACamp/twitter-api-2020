if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const passport = require('./config/passport.js')
const bodyParser = require('body-parser')

const router = require('./routes')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
