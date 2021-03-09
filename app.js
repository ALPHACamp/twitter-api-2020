if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const handlebars = require('express-handlebars')
const cors = require('cors')
const routes = require('./routes/index')
const passport = require('./config/passport')
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
// CORS
app.use(cors())
// app.use('/upload', express.static(__dirname + '/upload'))
app.use('/upload', express.static(path.join(__dirname, '/upload')))

// add swagger
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
// 設定 socket.io

app.get('/chats', (req, res) => {
  res.render('chat')
})

// 建立 socket.io
const httpserver = require('http').createServer(app)
const io = require('socket.io')(httpserver)
httpserver.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

app.use(routes)
require('./sockets')(io)
module.exports = app
