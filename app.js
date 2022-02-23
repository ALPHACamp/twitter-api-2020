if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const passport = require('./config/passport')
const helpers = require('./_helpers')
const { apis } = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())

app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  next()
})
app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api', apis)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
