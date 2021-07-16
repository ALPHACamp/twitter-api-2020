const express = require('express')
const http = require('http')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const server = http.createServer(app)

const passport = require('./config/passport')
const cors = require('./config/cors')

const routes = require('./routes')
const socketIo = require('./utils/socketio')

socketIo.init(server)
socketIo.connect()

const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())

app.use(routes)

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
