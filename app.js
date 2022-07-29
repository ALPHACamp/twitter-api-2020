if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')
const helpers = require('./_helpers');

const session = require('express-session')
const passport = require('./config/passport')

const cors = require('cors')
// Setting Cors

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(cors())
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())


app.use(routes)

// app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
