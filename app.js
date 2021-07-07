const express = require('express')
// const helpers = require('./_helpers');
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const jwt = require('jsonwebtoken')

const app = express()
const port = process.env.PORT || 3000
const routes = require('./routes')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('./config/passport');
const helpers = require('./_helpers')
const { getReqUserFromToken } = require('./middlewares/auth')
const { replaceReqUser } = require('./middlewares/mocha')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

// use helpers.getUser(req) to replace req.user
// function authenticated(req, res, next){
//   // passport.authenticate('jwt', { ses...
// };

app.use(passport.initialize())
app.use(passport.session())

app.use(getReqUserFromToken)

// for mocha test's requirement
app.use(replaceReqUser)

app.use(routes)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
