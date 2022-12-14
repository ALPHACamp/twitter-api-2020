if (process.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const routes = require('./routes')
const methodOverride = require('method-override')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000
// use helpers.getUser(req) to replace req.user
// / function authenticated (req, res, next) {
// passport.authenticate('jwt', { ses...
// }

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(methodOverride('_method'))
app.use('/api', routes)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
