const express = require('express')
const bodyParser = require('body-parser')
const helpers = require('./_helpers')
const app = express()
const port = process.env.PORT || 3000
require('../twitter-api-2020/models')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json') // 剛剛輸出的 JSON



if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/upload', express.static(__dirname + '/upload'))

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

require('./routes')(app)

app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))

module.exports = app
