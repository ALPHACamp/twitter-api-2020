if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const { getUser } = require('./_helpers')
const routes = require('./routes')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

const passport = require('./config/passport')
// use helpers.getUser(req) to replace req.user
// function authenticated (req, res, next) {
// passport.authenticate('jwt', { ses...
// }
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({ secret: process.env.SESSION_SECRET || 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

app.use('/api', routes)
app.get('/', (req, res) => res.send('Twitter'))
app.listen(port, () => console.log(`Twitter app listening on port ${port}!`))

module.exports = app
