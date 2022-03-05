const express = require('express')
const session = require('express-session')
const helpers = require('./_helpers')
const cors = require('cors')

const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT || 3000
const server = require('http').createServer(app)

server.listen(port, () => console.log(`Server is listening on port ${port}!`))

const passport = require('./config/passport')

// cors 的預設為全開放
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use('/upload', express.static(__dirname + '/upload'))
app.use((req, res, next) => {
  req.user = helpers.getUser(req)
  next()
})

require('./utils/socketio.js')(server)

require('./routes')(app)

module.exports = app
