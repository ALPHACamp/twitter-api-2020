const express = require('express')
const helpers = require('./_helpers')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next){
  // passport.authenticate('jwt', { ses...
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// 載入 routes
require('./routes')(app)

module.exports = app
