if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')

const app = express()
const port = process.env.PORT || 3000

const routes = require('./routes')
const passport = require('./config/passport')

const methodOverride = require('method-override')
const cors = require('cors')

// Setting Cors
app.use(cors())

// Setting body-parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Setting passport
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.user = getUser(req)
  next()
})

// Setting middleware
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.user = getUser(req)
  next()
})

app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
