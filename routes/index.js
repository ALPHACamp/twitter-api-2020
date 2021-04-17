const users = require('./modules/users')
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Simple Twitter API",
      description: "Simple Twitter API documentation",
      contact: {
        name: 'user',
        email: 'user@example.com'
      },
      servers: [
        'http://localhost:3000'
      ]
    }
  },
  apis: ['../routes/*.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)






module.exports = app => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
  app.use('/api/users', users)
  app.use('/api/admin', authenticated, authenticatedAdmin, admin)
  app.use('/api/tweets', authenticated, tweets)
  app.use('/api/followships', authenticated, followships)
}
