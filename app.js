if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const helpers = require('./_helpers')
const routes = require('./routes')
const bodyParser = require('body-parser')
const passport = require('./config/passport')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(passport.initialize())
// routes
app.use('/', routes)

// for api doc
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
