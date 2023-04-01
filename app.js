if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
const passport = require('./config/passport')
const routes = require('./routes/index')
const methodOverride = require('method-override')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use(cors())
app.use(routes)
app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`))

module.exports = app
