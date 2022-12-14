if (process.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
<<<<<<< HEAD
const { getUser } = require('./_helpers')
const routes = require('./routes')
=======
const helpers = require('./_helpers')
const routes = require('./routes')
const methodOverride = require('method-override')
const passport = require('./config/passport')
>>>>>>> 36f7ae15f623236c04eedbf7e1d48d0d35256d54

const app = express()
const port = process.env.PORT || 3000
app.use('/api', routes)
// use helpers.getUser(req) to replace req.user
// / function authenticated (req, res, next) {
// passport.authenticate('jwt', { ses...
// }

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(methodOverride('_method'))

<<<<<<< HEAD
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(routes)

=======
>>>>>>> 36f7ae15f623236c04eedbf7e1d48d0d35256d54
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
