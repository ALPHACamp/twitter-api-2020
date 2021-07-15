const path = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
require('./models')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const app = express()
const server = http.createServer(app)
const socket = require('socket.io')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/upload', express.static(__dirname + '/upload'))
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
require('./routes')(app)

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
})
io.on('connection', async socket => {
  console.log('connection')
  socket.on('disconnect', () => {
    console.log('disconnect')
  })
})

server.listen(port, () => console.log(`Example server listening on port http://localhost:${port}`))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err
  })
})

module.exports = app
