if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const cors = require('cors')

const { apis } = require('./routes')
const app = express()
// cors 的預設為全開放
app.use(cors())

const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(passport.initialize())
app.use(methodOverride('_method'))

app.use('/api', apis)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
