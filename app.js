if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const routes = require('./routes')
const passport = require('./config/passport')
const flash = require('connect-flash')
const session = require('express-session')
const SESSION_SECRET = 'secret'
<<<<<<< HEAD
const db = require('./models')
const path = require('path')
const methodOverride = require('method-override')
=======
const path = require('path')
const methodOverride = require('method-override')
const { getUser } = require('./helpers/auth-helpers')
>>>>>>> A02

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next){
  // passport.authenticate('jwt', { ses...
};

<<<<<<< HEAD
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
=======
app.use(express.urlencoded({ extened: true }))
app.use(express.json())
>>>>>>> A02
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(flash())
<<<<<<< HEAD
app.use(express.urlencoded({ extened: true }))
app.use(routes)

app.get('/', (req, res) => res.send('Hello World!'))
=======
app.use(routes)

//app.get('/', (req, res) => res.send('Hello World!'))
>>>>>>> A02
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
