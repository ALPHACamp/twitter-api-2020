const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
const exphbs = require('express-handlebars')
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
// 測試聊天室用的暫時路由
app.get('/', (req, res) => {
  res.render('index')
})
app.get('/private', (req, res) => res.render('private'))
require('./routes')(app)
require('./servers/server')(io)

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app