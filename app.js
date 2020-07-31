const express = require('express')
const handlebars = require('express-handlebars')
const helpers = require('./_helpers')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const db = require('./models')
const { User, Chat } = db
const records = require('./record')

const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
}))
app.set('view engine', 'handlebars')
// use helpers.getUser(req) to replace req.user
const passport = require('./config/passport');
const { random } = require('faker');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.json())

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  next()
})


function authenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      return res.status(401).json({
        status: 'error', message: "No auth token"
      })
    }
    req.user = user
    return next()
  })(req, res, next)
};

module.exports = http.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app, authenticated)

//chat

//上線名單
let userList = []

app.get('/chat', function (req, res) {
  return User.findByPk(1 + Math.ceil(Math.random() * 5), { include: Chat }) //之後用helper.get(req).id取代
    .then(user => {
      userList.push({
        name: user.toJSON().name,
        avatar: user.toJSON().avatar,
        account: user.toJSON().account,
      })
      let userLogin = {
        id: user.toJSON().id,
        name: user.toJSON().name,
        avatar: user.toJSON().avatar,
        account: user.toJSON().account,
      }
      res.render('chat', { userLogin });
    }
    )
});

app.get('/chat/private', function (req, res) {
  return User.findByPk(1 + Math.ceil(Math.random() * 5), { include: Chat }) //之後用helper.get(req).id取代
    .then(user => {
      userList.push({
        name: user.toJSON().name,
        avatar: user.toJSON().avatar,
        account: user.toJSON().account,
      })
      let userLogin = {
        id: user.toJSON().id,
        name: user.toJSON().name,
        avatar: user.toJSON().avatar,
        account: user.toJSON().account,
      }
      res.render('privateChat', { userLogin });
    }
    )
});

// 加入線上人數計數
let onlineCount = 0;

io.on('connection', function (socket) {

  //群聊

  onlineCount++;

  socket.on('login', function (userName) {
    socket.username = userName
    socket.broadcast.emit("oneLogin", socket.username)
  })

  io.emit("online", onlineCount, userList)
  // socket.emit("maxRecord", records.getMax());
  records.get((msgs) => {
    socket.emit("chatRecord", msgs);
  })

  socket.on('chat message', function (msg, id, avatar, name) {
    if (msg === '') return;
    records.push(msg, id, avatar, name)
  });
  socket.on('disconnect', () => {
    onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1;
    userList.forEach(function (x, index) {
      if (x.name === socket.username) {
        userList.splice(index, 1);
        //找到該用戶，刪除
      }
    })
    io.emit("online", onlineCount, userList)
    socket.broadcast.emit("oneLeave", socket.username)
  });

  //私聊
});

// 新增 Records 的事件監聽器
records.on("new_message", (msg, id, avatar, name) => {
  io.emit("send message", msg, id, avatar, name);
});