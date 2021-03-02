if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const routes = require('./routes/index')
const handlebars = require('express-handlebars')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser');

//add swagger
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

app.use(routes)

module.exports = app