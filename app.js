if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const routes = require('./routes')
const passport = require('./config/passport')
const cors = require('cors')
const { generalErrorHandler } = require('./middleware/error-handler')
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(cors())

app.use('/api', routes)
app.use('/', (req, res) => res.send('Hello World!')) // fallback
app.use(generalErrorHandler) // error handle
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
