const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const helpers = require('./_helpers')
const routes = require('./routes/')

const app = express()
const port = process.env.PORT || 3000

app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
