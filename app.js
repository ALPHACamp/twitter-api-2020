if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const methodOverride = require('method-override')
const passport = require('./config/passport')

const { apis } = require('./routes')
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(passport.initialize())
app.use(methodOverride('_method'))

app.use('/api', apis)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
