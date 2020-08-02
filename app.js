const express = require('express')
const session = require('express-session')
const handlebars = require('express-handlebars')
const helpers = require('./_helpers')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const db = require('./models')
const { User, Chat, Chatship } = db
const records = require('./record')
const privateRecord = require('./privateRecord')
const { Op } = require('sequelize')

const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')
// use helpers.getUser(req) to replace req.user
const passport = require('./config/passport');
const { random } = require('faker');
const { type } = require('os')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.json())


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // maxAge: 5 * 60 * 1000
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.user = helpers.getUser(req)
  res.locals.isAuthenticated = helpers.ensureAuthenticated(req)
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


const authenticator = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  // req.flash('warning_msg', '請先登入才能使用')
  res.redirect('/login')
}
//上線名單
let userList = []

app.get('/login', (req, res) => {
  return res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/chat',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '您已經成功登出。')
  res.redirect('/login')
})

app.get('/chat', authenticator, function (req, res) {
  return User.findByPk(helpers.getUser(req).id, { include: Chat }) //之後用helper.get(req).id取代
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
        channel: 'public'
      }
      res.render('chat', { userLogin });
    })
});

app.get('/chat/private', authenticator, function (req, res) {
  if (helpers.getUser(req).id !== 'undefined') {
    User.findByPk(helpers.getUser(req).id, {
      include: [
        { model: User, as: 'Chatwith' },
      ]
    }) //之後用helper.get(req).id取代
      .then(user => {
        User.findAll({ raw: true })
          .then(users => {
            const data = user.Chatwith.map(r => ({
              userId: r.id,
              userName: r.name,
              userAvatar: r.avatar,
              userAccount: r.account
            }))
            let userLogin = { channel: 'private' }
            return res.render('privateChat', {
              data,
              id: user.toJSON().id,
              name: user.toJSON().name,
              avatar: user.toJSON().avatar,
              users,
              userLogin
            })
          });
      }
      )
  }
  else {
    return res.redirect('/')
  }
});

app.post('/chat/private', function (req, res) {
  console.log(req.body)
  privateRecord.push(req.body.message, helpers.getUser(req).id, req.body.chatwithId, helpers.getUser(req).avatar, helpers.getUser(req).name)
  return res.redirect('/chat/private')
});

io.on('connection', function (socket) {

  //群聊

  socket.on('login', function (userName) {
    socket.username = userName
    socket.broadcast.emit("oneLogin", socket.username)
  })

  io.emit("online", userList.length, userList)
  // socket.emit("maxRecord", records.getMax());
  records.get((msgs) => {
    socket.emit("chatRecord", msgs);
  })

  socket.on('chat message', function (msg, id, avatar, name) {
    if (msg === '') return;
    records.push(msg, id, avatar, name)
  });
  socket.on('disconnect', () => {
    userList.forEach(function (x, index) {
      if (x.name === socket.username) {
        userList.splice(index, 1);
        //找到該用戶，刪除
      }
    })
    io.emit("online", userList.length, userList)
    if (typeof socket.username !== 'undefined') {
      socket.broadcast.emit("oneLeave", socket.username)
    }
  });

  //私聊
  socket.on('private-Record', function (loginUserId, chatUserId) {
    socket.chatwithId = chatUserId
    socket.loginUserId = loginUserId
    Chatship.findAll({
      where: { [Op.or]: [{ [Op.and]: [{ UserId: chatUserId }, { chatwithId: loginUserId }] }, { [Op.and]: [{ UserId: loginUserId }, { chatwithId: chatUserId }] }] },
      raw: true, nest: true,
      order: [['createdAt', 'ASC']],
      include: [User]
    }).then((msgs) => {
      socket.emit("privateChatRecord", msgs, chatUserId);
    })
  })

  socket.on('private chat message', function (msg, id, avatar, name, chatwithId, room) {
    if (msg === '') return;
    privateRecord.push(msg, id, chatwithId, avatar, name, room)
  })

  socket.on('join-me', function () {
    console.log(io.nsps['/'].adapter.rooms)
  }
  )

  socket.on('join-room', function (room) {
    //leave all room and join new room
    User.findAll({ raw: true }).then((users) => {
      let combineRoom = []
      let userId = users.map(user => user.id).sort()
      for (let i = 0; i < userId.length; i++) {
        let a2 = userId.concat();
        a2.splice(0, i + 1);
        for (let j = 0; j < a2.length; j++) {
          combineRoom.push(userId[i].toString() + a2[j].toString())
        }
      }
      for (let i = 0; i < combineRoom.length; i++) {
        socket.leave(combineRoom[i])
      }
      socket.join(room)
    })
  })
});

// 新增 Records 的事件監聽器
records.on("new_message", (msg, id, avatar, name) => {
  io.emit("send message", msg, id, avatar, name);
});

privateRecord.on("new_message", (msg, id, chatwithId, avatar, name, room) => {
  io.in(room).emit("send private message", msg, avatar, name);
  io.to(chatwithId).emit("notify", "hello")
});

