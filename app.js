const express = require('express');
const exphbs = require('express-handlebars')
const helpers = require('./_helpers')

const app = express()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))

require('./routes')(app)

app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  next()
})

app.use((err, req, res, next) => {
  return res.status(500).json({ Error: String(err) })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app