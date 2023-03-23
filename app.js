if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const passport = require('./config/passport')
const router = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.use(passport.initialize())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', router)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
