if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser')
const passport = require('./config/passport')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})

// socket io server, listen to connection
require('./socket/socketServer')(io)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(passport.initialize())
// routes
app.use('/', routes)

// for api doc
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

server.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app
