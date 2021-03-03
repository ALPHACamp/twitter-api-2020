if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require('cors')
const routes = require('./routes/index')
const passport = require('./config/passport')
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
// CORS
app.use(cors())
// app.use('/upload', express.static(__dirname + '/upload'))
app.use('/upload', express.static(path.join(__dirname, '/upload')))

// add swagger
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
