if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const socket = require('socket.io')
const passport = require('./config/passport')
const socketConnection = require('./public/javascripts/server')
const app = express()
const PORT = process.env.PORT || 3000

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))//for testing
app.use(methodOverride('_method'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.use('/upload', express.static(__dirname + '/upload'))
app.use(flash())
app.use(session({ secret: 'process.env.SESSION_SECRET', resave: false, saveUninitialized: false }))

app.use(passport.initialize())
app.use(passport.session())
const server = app.listen(PORT, () => {
  console.log('server on')
})

require('./routes')(app)
const io = socket(server)
socketConnection(io)
module.exports = app 