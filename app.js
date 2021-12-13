const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')
const helpers = require('./_helpers')
if (process.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT

//bodyparse set
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.use(session({ secret: 'numberFive', saveUninitialized: true, resave: false }))
const passport = require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

app.use(cors())
server.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app

require('./routes/index')(app)
require('./socket/socket')(server)
