const path = require('path')
const express = require('express')
const session = require('express-session')
const routes = require('./routes')
const passport = require('./config/passport')

// const { getUser } = require('./_helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
<<<<<<< HEAD
const PORT = process.env.PORT
=======
const port = process.env.PORT || 3000
>>>>>>> 4ccf7dbe141a416b296a0fc73a2982ff9fdf4c09

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/upload', express.static(path.join(__dirname, 'upload')))
// use helpers.getUser(req) to replace req.user
// function authenticated (req, res, next) {
//   // passport.authenticate('jwt', { ses...
// };

app.use(routes)
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app
