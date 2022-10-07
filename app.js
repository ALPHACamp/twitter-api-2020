if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const routes = require('./routes')
const passport = require('./config/passport')
const helpers = require('./_helpers')
const cors = require('cors')
const corsOption = {
  origin: [
    'https://twitter-api-2022-10.herokuapp.com/',
    'http://localhost:3000'
  ],
  methods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}

const app = express()
const port = 3000
require('./models')

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // set response format
app.use(passport.initialize()) // init passport.js
app.use((req, res, next) => {
  req.user = helpers.getUser(req) // global req.user
  next()
})
app.use(cors(corsOption))

app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
