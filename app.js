const express = require('express');
const helpers = require('./_helpers');
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const cors = require('cors')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const passport = require('./config/passport')
const app = express()
const port = process.env.PORT || 3000



app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))
app.use(flash())



app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

//建立http服務
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
})

// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

require('./routes')(app);
require('./socket/socketio')(io);

http.listen(port, () => console.log(`Server Started. at http://localhost:${port}`));

module.exports = app;
