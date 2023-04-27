if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')
const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')
const helpers = require('./_helpers')
const session = require('express-session')
const passport = require('./config/passport')

const cors = require('cors')
// Setting Cors

const app = express()
const port = process.env.PORT || 3000
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};

let sessionSecretForTest
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
  sessionSecretForTest = 'secret'
}


app.use(cors())
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: sessionSecretForTest ? sessionSecretForTest : process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())


app.use(routes)


app.listen(port, () => console.log(`App is listening on port ${port}!`))

module.exports = app
