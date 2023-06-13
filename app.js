if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
// const { initWebSocket } = require('./websocket')

const routes = require('./routes')
const methodOverride = require('method-override')
const passport = require('passport')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000
const http = require('http')
const server = http.createServer(app)

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(methodOverride('_method'))

// web socket
// app.get('/chat', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })
// initWebSocket(server)

app.use(routes)
app.get('', (req, res) => {
  res.send('Hello world!')
})
app.get('/favicon.ico', (req, res) => {
  res.sendStatus(204)
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
