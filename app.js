const express = require('express')
const helpers = require('./_helpers')
const passport = require('./config/passport')
const bodyParser = require('body-parser')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = 3000
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(passport.initialize())
// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
}

require('./routes')(app)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
