if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const helpers = require('./_helpers')
const express = require('express')
const methodOverride = require('method-override')

const routes = require('./routes')
const passport = require('./config/passport')


const app = express()
const port = 3000

app.use(passport.initialize())
app.use(passport.session())

app.use(methodOverride('_method'))
app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  next()
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
