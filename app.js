const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')

const helpers = require('./_helpers')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))

app.listen(port, () => console.log(`App listening on port ${port}!`))

require('./routes')(app)

module.exports = app
