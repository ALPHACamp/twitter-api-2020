const express = require('express')
const helpers = require('./_helpers');
const bodyParser = require('body-parser')
const app = express()
const port = 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// use helpers.getUser(req) to replace req.user

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
require('./routes')(app)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
