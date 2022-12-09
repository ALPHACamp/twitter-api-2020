if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')

const passport = require('./config/passport')
const routes = require('./routes')
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
