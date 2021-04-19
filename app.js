const express = require('express')
const bodyParser = require('body-parser')

// .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('./models')
const helpers = require('./_helpers')


const app = express()
const port = 3000

// 載入 bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
}

// 載入 routes
require('./routes')(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
