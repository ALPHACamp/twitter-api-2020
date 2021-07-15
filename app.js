const express = require('express')
const app = express()
//socket
const server = require('http').createServer(app);
const io = require('socket.io')(server)
const { createAdapter } = require("@socket.io/mongo-adapter");
const SocketHander = require('./socket/index')

const cors = require('cors')
const methodOverride = require('method-override')

io.on('connection', () => { /* … */ });
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT
const helpers = require('./_helpers')
app.use(methodOverride('_method'))

app.use(cors())
app.use(express.urlencoded({ extended: true })) //用來解析表單
app.use(express.json()) //用來解析json
app.use('/upload', express.static(__dirname + '/upload'))
require('./config/mongoose')

let count = 1
io.on('connection', (socket) => {

  socket.emit('chat message', '連線成功！');
  socket.on('chat message', (msg) => {
    SocketHander.storeMessages(msg)
    const date = new Date()
    io.emit('chat message', `${date} ${msg}`);
    socket.emit('chat message', `後端收到訊息第${count}次`);
    count++
  });

  socket.on('disconnect', () => {
    io.emit('chat message', '有人離開聊天室')
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

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//socket
server.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
