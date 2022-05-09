if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const port = process.env.PORT || 3000
const app = express()

const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')

const SESSION_SECRET = process.env.SESSION_SECRET

app.engine('handlebars', handlebars.engine({ extname: '.handlebars', helpers }))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(methodOverride('_method'))

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next){
  // passport.authenticate('jwt', { ses...
};

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`))

module.exports = app
