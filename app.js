if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const passport = require('./config/passport')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
