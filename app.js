if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const path = require('path')
const express = require('express')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const { apis } = require('./routes')

const app = express()
const PORT = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(passport.initialize())
// use helpers.getUser(req) to replace req.user
// authenticate user before enter api routes
// function authenticated (req, res, next) {
//   passport.authenticate('jwt', { session: false })
// }

app.use('/api', apis)
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app
