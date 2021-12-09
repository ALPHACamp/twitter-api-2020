const express = require('express')
const helpers = require('./_helpers');
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const db = require('./models')
const flash = require('connect-flash')
const session = require('express-session')
const cors = require('cors')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('./config/passport')

//-----------
const handlebars = require('express-handlebars')
//-----------

const app = express()
const port = process.env.PORT || 3000

//for handlebars
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')

// setup bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
// setup session and flash
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use('/upload', express.static(__dirname + '/upload'))

// setup passport
app.use(passport.initialize())
app.use(passport.session())
app.use(cors());

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
  res.locals.current_user = req.user // 加這行
  next()
})
//-----------

// app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

module.exports = app
