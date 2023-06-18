if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require('cors')

const helpers = require('./_helpers');
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  next()
})

app.use(routes)

app.listen(port, () => console.log(`This server is listening on port ${port}!`))

module.exports = app
