if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT

//integrate socket server to main server
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    credentials: true
  }
})
require('./socket/socketServer')(io)

require('./config/passport')
const routes = require('./routes/index')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(routes)

app.use((err, req, res, next) => {
  console.log(err)
  return res.status(500).json({ status: 'error', message: '內部伺服器錯誤' })
})

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))