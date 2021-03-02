if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const routes = require('./routes/index')
const handlebars = require('express-handlebars')
const passport = require('./config/passport')
const app = express()
const port = process.env.PORT || 3000
app.use('/upload', express.static(__dirname + '/upload'))

//add swagger
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

app.use(routes)

module.exports = app