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
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

http.listen(port, () => console.log(`Socket Start. Listening on port ${port}！`))

require('./routes')(app)

module.exports = app
