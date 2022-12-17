if (process.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const routes = require('./routes')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

const corsOptions = {
  origin: [
    'http://localhost:3000'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(methodOverride('_method'))
app.use('/api', routes)
app.get('/', (req, res) => res.send('You Did It!!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.get('/', (req, res) => { res.send('hello') })
module.exports = app
