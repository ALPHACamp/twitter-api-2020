const express = require('express')
const apiErrorHandler = require('./middleware/errorHandler')
const cors = require('cors')
const methodOverride = require('method-override')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require('./routes')
const passport = require('./config/passport')
const app = express()
const PORT = process.env.PORT || 3000
const server = require('http').createServer(app)

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(passport.initialize())

app.use(methodOverride('_method'))

app.use('/upload', express.static(__dirname + '/upload'))

app.use(routes)

app.use(apiErrorHandler)

app.use(express.static('public'))

// when user go to the website return index.html
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})

require('./socket/server')(server)

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app
