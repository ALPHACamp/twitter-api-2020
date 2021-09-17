const express = require('express')
const helpers = require('./_helpers')
const routes = require('./routes')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(flash())
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req) // 取代 req.user
  next()
})

app.use(routes)

module.exports = app
