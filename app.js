/* NOTE
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
*/

// params
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const port = process.env.PORT || 3000

// modules and files
const express = require('express')
const cors = require('cors')
const helpers = require('./_helpers')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('./config/passport.js')
const routes = require('./routes/index.js')

// web server settings
const app = express()

// other middleware settings, request will go through this part
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors())

// routes
app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api', routes)
app.use(cors())

// start API web server
app.listen(port, () => console.log(`API Web Server app listening on port ${port}!`))

module.exports = app
