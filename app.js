if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const path = require('path')

const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

// setting
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
