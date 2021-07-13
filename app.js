const path = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
require('./models')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json') // 剛剛輸出的 JSON

const app = express()
const server = http.createServer(app)

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
require('./config/socket').socket(server)

server.listen(port, () => console.log(`Example server listening on port http://localhost:${port}`))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err
  })
})

module.exports = app