if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const routes = require('./routes')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const cors = require('cors')
const app = express()

// create socket.io server
const { createServer } = require('http')
const httpServer = createServer(app)
const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
    credentials: true
  }
})
const useSocket = require('./socket/index')
const port = process.env.PORT || 3000

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(methodOverride('_method'))

// cors
app.use(
  cors({
    // origin: 'https://zebrrrra.github.io',
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  })
)

// routes
app.get('/', (req, res) => { res.send('Welcome to the real world!') })
app.use(routes)

// use socket modules
useSocket(io)

// start
httpServer.listen(port, () => console.log(`Server running on port:${port}!`))

module.exports = app
