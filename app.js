if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const port = process.env.PORT || 3000
const app = express()
<<<<<<< HEAD

=======
const helpers = require('./_helpers')
const handlebars = require('express-handlebars')
>>>>>>> feature/api/users
const session = require('express-session')
const passport = require('./config/passport')
const apis = require('./routes')

const SESSION_SECRET = process.env.SESSION_SECRET

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api', apis)
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`))

module.exports = app
