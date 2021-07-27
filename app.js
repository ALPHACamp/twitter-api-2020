const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cors = require('cors')

const server = require('http').createServer(app)

app.use(cors())

const buildSocket = require('./server')

const port = process.env.PORT || 3000
const routes = require('./routes')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('./config/passport');
const { replaceReqUser } = require('./middlewares/mocha')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

app.use(passport.initialize())
app.use(passport.session())

// for mocha test's requirement
app.use(replaceReqUser)

buildSocket(server)

app.use(routes)

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
