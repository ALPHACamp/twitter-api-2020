const express = require('express')
const cors = require('cors')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require('./routes/')

const app = express()

app.use(cors()) // using default set CORS header
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(routes)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
