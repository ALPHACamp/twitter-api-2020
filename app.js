if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')
const express = require('express')
const methodOverride = require('method-override')
const session = require('express-session')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))



app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`))

module.exports = app
