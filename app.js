if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const routes = require('./routes')
const { getUser } = require('./helpers/auth-helpers')


const app = express()
const port = 3000
const SESSION_SECRET = 'secret'

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))

app.use(passport.initialize()) 
app.use(passport.session()) 
app.use(methodOverride('_method'))
app.use(flash()) // 掛載套件
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') 
  res.locals.error_messages = req.flash('error_messages') 
  res.locals.user = getUser(req)
  next()
})

app.use('/api', routes)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app