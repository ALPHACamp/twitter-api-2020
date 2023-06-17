if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes')

const methodOverride = require('method-override')

const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000

// middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// usePassport(app)

app.use(express.urlencoded({ extended: true }))

app.use(routes)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
