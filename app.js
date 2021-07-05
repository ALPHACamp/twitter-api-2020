const db = require('./models')
const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const helpers = require('./_helpers')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))

// for mocha test's requirement
app.use((req, res, next) => {
  req.user = helpers.getUser(req)
  next()
})

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
}

app.use(methodOverride('_method'))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))

module.exports = app
