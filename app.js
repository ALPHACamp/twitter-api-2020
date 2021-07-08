if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const app = express()
const port = process.env.PORT || 3000
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  next()
})
app.listen(port, () => console.log(`App is listening on http://localhost:${port}!`))

require('./routes')(app)
app.use((err, req, res, next) => {
  res.json({ status: 'error', message: err.message })
  console.log(err.message)
})
module.exports = app
