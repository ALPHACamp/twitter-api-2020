if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const helpers = require('./_helpers')
const routes = require('./routes')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// routes
app.use('/', routes)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
