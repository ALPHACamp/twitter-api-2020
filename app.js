if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
const passport = require('./config/passport')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())

app.listen(port, () =>
  console.log(`SimpleTwitter app listening on port ${port}!`)
)

require('./routes')(app, passport)
module.exports = app
