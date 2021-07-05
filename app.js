const express = require('express');
const app = express()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  return next()
})

require('./routes')(app)

app.use((err, req, res, next) => {
  return res.status(500).json({ Error: String(err) })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
