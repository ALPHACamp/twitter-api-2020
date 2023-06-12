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

// 也試過直接打 app.use(cors()) 使用他的default這定
app.use(cors({
  origin: ['https://leemengyun.github.io', 'http://localhost:3000/', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: true,
  credentials: true,
  optionsSuccessStatus: 204
}))

app.use(routes)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
