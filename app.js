if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const cors = require('cors')

const passport = require('./config/passport')

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.listen(port, () => console.log(`App listening on port ${port}!`))

require('./routes')(app)

module.exports = app
