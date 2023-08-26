if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require('cors')
const methodOverride = require('method-override')
const helpers = require('./_helpers')
const { apis } = require('./routes')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000

// set CORS
app.use(cors())
const corsOptions = {
  origin: [
    'https://young-waters-15158-8b230f0b0919.herokuapp.com',
    'http://localhost:8080'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use('/api', apis)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
