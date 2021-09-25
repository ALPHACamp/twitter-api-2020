const express = require('express')
const helpers = require('./_helpers')
const bodyParser = require('body-parser')
const cors = require('cors')
const exphbs = require('express-handlebars')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()

const passport = require('./config/passport')

const port = process.env.PORT || 3000

const server = require('http').Server(app);
const io = require('socket.io')(server);

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())
app.use(passport.initialize())
app.use('/upload', express.static(__dirname + '/upload'))
require('./routes')(app)

let onlineCount = 0;

// 修改 connection 事件
io.on('connection', (socket) => {
  onlineCount++;
  io.emit("online", onlineCount);

  socket.on("greet", () => {
    socket.emit("greet", onlineCount)
  })

  socket.on('disconnect', () => {
    onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1;
    io.emit("online", onlineCount)
  })

  socket.on("send", (msg) => {
    io.emit("msg", msg)
  })

  socket.on("userin", (msg) => {
    io.emit("userin", msg)
  })

  socket.on("userout", (msg) => {
    io.emit("userout", msg)
  })
})


app.use((err, req, res, next) => {
  res.status(422).json({
    status: 'error',
    message: err.message
  })
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))
module.exports = app
