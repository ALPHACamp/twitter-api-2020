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

const server = require('https').createServer(app)

// http
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.json())

app.use(passport.initialize())
app.use(express.static('public'))

require('./socket/server')(server)

app.use('/api', router)
server.listen(PORT, () =>
  console.log(`Alphitter api server listening on port ${PORT}!`)
)
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})

module.exports = app
