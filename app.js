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
const app = express()
const port = process.env.PORT || 3000
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const { wrap } = require('./modules/socket.js')

app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'main' }))
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

io.use(wrap(passport.initialize()))
require('./sockets')(io)

http.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
