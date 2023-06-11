if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const methodOverride = require('method-override')
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://leemengyun.github.io')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Credentials', true)
  next()
})

app.use(cors({
  origin: 'https://leemengyun.github.io',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: '*',
  preflightContinue: true,
  credentials: true
}))

app.use(routes)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
