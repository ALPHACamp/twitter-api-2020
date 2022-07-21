if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const routes = require('./routes/index')
const helpers = require('./_helpers')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
  res.user = helpers.getUser(req)
  next()
})

app.use('/', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
