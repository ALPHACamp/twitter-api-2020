if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const passport = require('./config/passport')
const routes = require('./routes')
const app = express()
const cors = require('cors')
const path = require('path')
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use('/api', routes)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
