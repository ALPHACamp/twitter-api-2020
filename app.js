const express = require('express')
const helpers = require('./_helpers')
const cors = require('cors')
const bodyParser = require('body-parser')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./models')

// swagger settings
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple Twitter API',
      version: '1.0.0',
      description: 'Simple Twitter API documentation',
      contact: {
        name: 'support', // dummy info
        email: 'support@example.com' // dummy info
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development'
      },
      {
        url: 'https://simple-twitter-api-2021.herokuapp.com',
        description: 'Production'
      }
    ]
  },
  apis: ['./routes/modules/*.js']
}

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// use swagger route
const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

module.exports = app
