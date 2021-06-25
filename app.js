const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./models')

const app = express()
const http = require('http')
const server = http.createServer(app)
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '/public')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Set up static file
app.use(express.static(publicDirectoryPath))

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)
require('./utils/socket').socket(server)

app.use((error, req, res, next) => {
  console.error(error.stack)
  res.status(500).json({
    status: 'error',
    message: 'Something broke!'
  })
})

module.exports = app
