const express = require('express')
const cors = require('cors')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('./config/passport')
const methodOverride = require('method-override')
const router = require('./routes')

const app = express()
const PORT = process.env.PORT

// http
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.json())

app.use(passport.initialize())

app.use('/api', router)
app.listen(PORT, () =>
  console.log(`Alphitter api server listening on port ${PORT}!`)
)

module.exports = app
