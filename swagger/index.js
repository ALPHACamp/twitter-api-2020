const swaggerUi = require('swagger-ui-express')
const swaggerOutputJson = require('./swagger_output.json')

module.exports = app => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutputJson))
}
