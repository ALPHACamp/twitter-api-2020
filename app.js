if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')
const express = require('express')
const session = require('express-session')
const passport = require('./config/passport')
const cors = require('cors')
const { apis } = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = process.env.SESSION_SECRET

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use('/api', apis)

app.listen(port, () => console.log(`Simple Twitter app listening on port ${port}!`))

module.exports = app
