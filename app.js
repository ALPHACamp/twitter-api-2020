if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const cors = require('cors')
const app = express()
const httpServer = require('http').createServer(app)
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  next()
})

httpServer.listen(port, () => console.log(`App is listening on http://localhost:${port}!`))

require('./routes')(app)
require('./socket')(httpServer)
app.use((err, req, res, next) => {
  res.json({ status: 'error', message: err.message })
  console.error(err)
})
module.exports = app
