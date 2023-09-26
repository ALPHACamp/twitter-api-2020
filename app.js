if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const routes = require('./routes')
const passport = require('./config/passport')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

// Set body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// 初始化 passport
app.use(passport.initialize())

app.use(cors())
// Set routes
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
