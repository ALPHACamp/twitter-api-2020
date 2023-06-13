if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')
const express = require('express')
const routes = require('./routes')
const methodOverride = require('method-override')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')

app.use(express.urlencoded({ extended: true }))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(methodOverride('_method'))
app.use(express.json())

app.use(
  cors({
    origin: [
      process.env.GITHUB_PAGE,
      'http://localhost:3000/'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false
  })
)

app.use(routes)
app.get('/', (req, res) => res.send('Hello Kitty - Users/Tweets Done'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
