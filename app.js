if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const session = require('express-session')
const passport = require('./config/passport')
const flash = require('connect-flash')
const path = require('path')

const methodOverride = require('method-override')
const routes = require('./routes')
const { getUser } = require('./_helpers')


const app = express()
const port = 3000
const SESSION_SECRET = 'secret'

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use((err, req, res, next) => {
  if (err) console.error(err)
  next()
})
app.use(passport.initialize()) 
app.use(passport.session()) 
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})
app.use(routes)

app.get('', (req, res) => {
  res.send('Hello world!')
})
app.get('/favicon.ico', (req, res) => {
  res.sendStatus(204)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app