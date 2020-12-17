if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const db = require('./models')
const routes = require('./routes')
const helpers = require('./_helpers')
const bodyParser = require('body-parser')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT


app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())
routes(app)

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Example app listening on http://localhost:${port}`)
})

module.exports = app
