const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.broadcast.emit('hi');
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

http.listen(2000, () => {
  console.log('listening on *:2000');
});

require('./routes')(app)

module.exports = app
