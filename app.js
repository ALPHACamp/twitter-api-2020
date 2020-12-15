const express = require('express')
const db = require('./models')
const routes = require('./routes')
const helpers = require('./_helpers')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
routes(app)

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Example app listening on http://localhost:${port}`)
})

module.exports = app
