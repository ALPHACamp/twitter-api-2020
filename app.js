const express = require('express')
const helpers = require('./_helpers')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./models')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

module.exports = app
