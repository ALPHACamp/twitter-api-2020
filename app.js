if (process.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const methodOverride = require('method-override')
const cors = require('cors')

const routes = require('./routes')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(passport.initialize())
app.use(methodOverride('_method'))
app.use('/api', routes)
app.get('/', (req, res) => res.send('You Did It!!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
