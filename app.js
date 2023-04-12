if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const path = require('path')
const express = require('express')
const routes = require('./routes')
const passport = require('./config/passport')
const cors = require('cors')
const corsOption = {
  origin: [
    'https://m790101.github.io',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:8000',
    'http://localhost:8081'
  ],
  methods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}

const app = express(corsOption)
const port = process.env.PORT || 3000
require('./models')

// middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // set response format
app.use(passport.initialize()) // init passport.js
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(cors())
app.use('/test', (req, res) => res.json('成功'))
app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
