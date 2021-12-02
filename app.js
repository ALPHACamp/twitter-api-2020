const express = require('express')
const helpers = require('./_helpers');
const bodyParser = require('body-parser')

const db = require('./models')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')

//-----------
const handlebars = require('express-handlebars')
//-----------

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next){
  // passport.authenticate('jwt', { ses...
};

//for handlebars
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  // helpers: require('./config/handlebars-helpers')
})) //{ defaultLayout: 'main' } could be ignored since it has become default in handlebars v3.1.0
app.set('view engine', 'handlebars')

// setup bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// setup session and flash
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())

// setup passport
app.use(passport.initialize())
app.use(passport.session())

// put req.flash into res.locals
// app.use((req, res, next) => {
//   res.locals.success_messages = req.flash('success_messages')
//   res.locals.error_messages = req.flash('error_messages')
//   next()
// })

//-----------
//pending
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user // 加這行
  next()
})
//-----------

// app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

module.exports = app
