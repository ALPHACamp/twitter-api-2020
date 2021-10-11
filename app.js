const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
const exphbs = require('express-handlebars')
const http = require('http')
const server = http.createServer(app)

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// app.engine('handlebars', exphbs())
// app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
// 引入socket server
require('./servers/index')(server)

// 測試聊天室用的暫時路由
// app.get('/public', (req, res) => res.render('index'))
// app.get('/private', (req, res) => res.render('private'))
// app.get('/notify', (req, res) => res.render('notification'))

require('./routes')(app)
server.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app