const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helpers = require('./_helpers.js')
const db = require('./models')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = process.env.PORT
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// })

const activeUserList = [];

const setUserInfo = (userId, socketId) => ({ userId, socketId });

const setResultData = (isSuccess, data) => (!isSuccess ? {
  isSuccess,
  description: data,
} : {
    isSuccess,
    ...data,
  });

const checkDuplicatedId = id => activeUserList.some(obj => obj.userId === id);

io.on('connection', (socket) => {
  console.log('a user connected', socket.id)

  socket.on('login', (userId, callback) => {
    console.log(`Client logged-in:\n userId:${userId}`);

    if (checkDuplicatedId(userId)) {
      callback(setResultData(false, 'A user with the same ID exists. Please use a different ID.'));
    }

    socket.userId = userId;

    const userInfo = setUserInfo(userId, socket.id);
    activeUserList.push(userInfo);

    callback(setResultData(true, {
      description: 'Login Success',
      roomList: rooms.getRooms(),
      userInfo,
    }));
  });


  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
  socket.on('chat message', (msg) => {
    console.log('message: ', { msg: msg, id: socket.id })
  })
  socket.on('chat message', (msg) => {
    io.emit('chat message', { msg: msg, id: socket.id })
  })
})

http.listen(port, () => console.log(`Socket Start. Listening on port ${port}！`))

require('./routes')(app)

module.exports = app
