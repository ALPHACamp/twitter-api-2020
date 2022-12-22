if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const passport = require('./config/passport')
const { apiErrorHandler } = require('./middleware/error-handler')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
// cors 的預設為全開放
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())

app.use('/api', routes)
app.use('/', apiErrorHandler)
app.use('/', (req, res) => {
  res.send('Thanks AC!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
