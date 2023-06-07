const express = require('express')
const helpers = require('./_helpers')
const routes = require('./routes')
const passport = require('./config/passport')
const flash = require('connect-flash')
const session = require('express-session')
const SESSION_SECRET = 'secret'
const db = require('./models')
const path = require('path')
const methodOverride = require('method-override')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next){
  // passport.authenticate('jwt', { ses...
};

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(flash())
app.use(express.urlencoded({ extened: true }))
app.use(routes)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
