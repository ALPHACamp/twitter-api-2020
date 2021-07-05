const express = require('express')
const bodyParser = require('body-parser')
const helpers = require('./_helpers')
const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// for mocha test's requirement
app.use((req, res, next) => {
  req.user = helpers.getUser(req)
  next()
})

require('./routes')(app)

app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))

module.exports = app
