if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const { clearTemp } = require('./helpers/file-helper')
const routes = require('./routes')
const passport = require('./config/passport')
const cors = require('cors')
const { generalErrorHandler } = require('./middleware/error-handler')
const app = express()
const port = process.env.PORT || 3000

const corsOptions = {
  origin: [
    'https://s339428326.github.io',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())

app.use('/api', routes)
app.use('/', (req, res) => res.send('Hello World!')) // fallback
app.use(generalErrorHandler) // error handle
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

setInterval(clearTemp, 43200000)
module.exports = app
