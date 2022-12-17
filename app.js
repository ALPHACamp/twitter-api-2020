if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const helpers = require('./_helpers')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')// 不確定不需要
const passport = require('./config/passport')
const cors = require('cors')
// const { getUser } = require('./helpers/auth-helpers')
const { apis } = require('./routes')

const app = express()
const port = 8080
const SESSION_SECRET = 'secret'

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(cors())
// app.use(flash())
// app.use((req, res, next) => {
//   res.locals.success_messages = req.flash('success_messages')
//   res.locals.error_messages = req.flash('error_messages')
//   res.locals.user = helpers.getUser(req)
//   next()
// })

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use('/api', apis)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
