const express = require('express')
const helpers = require('./_helpers');

const app = express()
const port = process.env.PORT || 3000

const passport = require('./config/passport')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};

require('./routes')(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
