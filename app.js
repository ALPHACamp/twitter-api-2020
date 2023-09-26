if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')
const express = require('express')
const cors = require('cors')
const methodOverride = require('method-override')
const { apis } = require('./routes')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000

// set CORS
const corsOptions = {
  origin: [
    'https://james-lee-01.github.io',
    'http://localhost:3000'
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
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use('/api', apis)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
