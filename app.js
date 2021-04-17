const express = require('express')
const helpers = require('./_helpers')
const bodyParser = require('body-parser')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./models')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

module.exports = app
