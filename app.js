const express = require('express')
const helpers = require('./_helpers')

const app = express()
const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('./config/passport')
const PORT = process.env.PORT || 3000

// Setting body-parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Setting passport
app.use(passport.initialize())

// Setting middleware: method-override
app.use(methodOverride('_method'))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
)

module.exports = app
