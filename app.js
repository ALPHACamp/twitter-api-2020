if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')
const express = require('express')
const cors = require('cors')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const publicPath = path.join(__dirname, '/public')
const routes = require('./routes')

const app = express()
const http = require('http')
const server = http.createServer(app)
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(express.static(publicPath))
app.use(cors())

app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use('/api', routes)
require('./socket/index').socket(server)

server.listen(port, () => console.log(`Example app listening on http://localhost:${port}`))

module.exports = app
