const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('./config/passport')
const methodOverride = require('method-override')
const router = require('./routes')

const app = express()
const port = 3000

// http
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.json())

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
}

app.use(passport.initialize())

app.use('/api', router)
app.listen(port, () =>
  console.log(`Alphitter api server listening on port ${port}!`)
)

module.exports = app
