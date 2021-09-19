const express = require('express')
const helpers = require('./_helpers')
const cors = require('cors')
const methodOverride = require('method-override')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require('./routes')
const passport = require('./config/passport')
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(passport.initialize())

app.use(methodOverride('_method'))

app.use('/upload', express.static(__dirname + '/upload'))

app.use(routes)

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app
