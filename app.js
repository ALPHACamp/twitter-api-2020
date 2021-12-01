const express = require('express')
const helpers = require('./_helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//Setting server
const app = express()
const port = 3000

//Setting middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

require('./routes')(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
