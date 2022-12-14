if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')

const routes = require('./routes')

const app = express()
const port = 3000

app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
