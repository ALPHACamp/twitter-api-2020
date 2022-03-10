if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const helpers = require('./_helpers')
const passport = require('./config/passport')
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 3000

// use helpers.getUser(req) to replace req.user
// function authenticated(req, res, next){
//   passport.authenticate('jwt', { ses...
// }

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(routes)

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))


module.exports = app
