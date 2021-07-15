const express = require('express')
const app = express()


//socket
const server = require('http').createServer(app);
const io = require('socket.io')(server)

const cors = require('cors')
const methodOverride = require('method-override')

const { Server, Socket } = require('socket.io')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT


const helpers = require('./_helpers');

app.use(methodOverride('_method'))

app.use(cors())
app.use(express.urlencoded({ extended: true })) //用來解析表單
app.use(express.json()) //用來解析json
app.use('/upload', express.static(__dirname + '/upload'))


io.on('connection', (socket, req, res) => {
  console.log('user connection')
  // console.log(helpers.getUser(req))
  socket.on('chat message', (msg) => {
    const date = new Date()
    io.emit('chat message', `${date} ${msg}`);
  });
  socket.on('disconnect', () => {
    console.log('user disconnect')
  })
})

app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  return next()
})

require('./routes')(app)

app.use((err, req, res, next) => {
  return res.status(500).json({ Error: String(err) })
})

// app.listen(port, () => console.log(`app listening on port ${port}!`))

//socket
server.listen(port, () => console.log(`server listening on port ${port}!`))

module.exports = app
