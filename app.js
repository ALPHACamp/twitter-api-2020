const express = require('express')

const app = express()
const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const cors = require('cors')
const httpServer = require('http').createServer(app)
const routes = require('./routes')
const apiErrorHandler = require('./middlewares/apiErrorHandler')
const passport = require('./config/passport')
const PORT = process.env.PORT || 3000
const socket = require('./config/socket')
const socketEvents = require('./socket')

// Setting CORS
app.use(cors())

// Setting body-parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Setting passport
app.use(passport.initialize())

// Setting middleware: method-override
app.use(methodOverride('_method'))

// Setting Socket.io Server
const io = socket.initialize(httpServer)
socketEvents(io)

// Setting express router
app.use(routes)

// Setting custom error handling
app.use(apiErrorHandler)

httpServer.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
)

module.exports = app
