const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// use helpers.getUser(req) to replace req.user

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
require('./routes')(app)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app