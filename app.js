const path = require('path')
const express = require('express')
const helpers = require('./_helpers')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const cors = require('cors')

const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT || 3000
const passport = require('./config/passport')

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({ secret: 'itismyserect', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use('/upload', express.static(path.join(__dirname, '/upload')))

app.use((req, res, next) => {
  res.locals.success_message = req.flash('success_message')
  res.locals.error_message = req.flash('error_message')
  res.locals.user = helpers.getUser(req)
  next()
})

app.use(cors())
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:8080', 'https://r05323045.github.io'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
})

http.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))

require('./routes')(app)
require('./config/socketio')(io)

module.exports = app
