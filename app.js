if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const passport = require('./config/passport.js')
const bodyParser = require('body-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const cors = require('cors')
const exphbs = require('express-handlebars')

const router = require('./routes')
const hbsHelpers = require('./config/handlebars-helpers.js')
const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'main', helpers: hbsHelpers }))
app.set('view engine', 'hbs')
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use(router)
app.use(function (err, req, res, next) {
  console.error(err.stack)
  return res.status(500).json({ status: 'error', message: `${err.stack}` })
})

const http = require('http').createServer(app)
const io = require('socket.io')(http)
require('./sockets')(io)

http.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
