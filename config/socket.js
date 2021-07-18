const { User, Chat, Chatroom } = require('../models')
const helpers = require('../_helpers')
const sessionStore = require('sessionstore')
const passportSocketIo = require("passport.socketio");
const cookieParser = require('cookie-parser')
const session = require("express-session");

const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const passportJwtSocketIo = require('passport-jwt.socketio')

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

async function verify(jwt_payload, done) {
  try {
    const user = await User.findByPk(jwt_payload.id, {
      attributes: ['id', 'name', 'avatar']
    })
    if (!user) return done(null, false)
    return done(null, user.toJSON())
  }
  catch (err) {
    return done(err, null)
  }
}

const io = (http) => {

  const users = []

  const io = require('socket.io')(http, {
    cors: {
      origin: "*"
    }
  })

  io.use(passportJwtSocketIo.authorize(options, verify))
  io.use((socket, next) => {
    if (socket.handshake.user.name) {
      next();
    } else {
      next(new Error("unauthorized"))
    }
  });

  io.on('connection', (socket) => {
    const { name, id } = socket.handshake.user

    const index = users.map(user => { return user.id }).indexOf(id)

    if (index < 0) {
      users.push(socket.handshake.user)
    }
    socket.emit('totalUser', users)
    socket.broadcast.emit('joinRoom', `${name}上線`);
    socket.on('chatMessage', (msg) => {
      Chat.create({
        UserId: id,
        message: msg,
        ChatroomId: 5
      })
      io.emit('chatMessage', msg, socket.handshake.user);
    });
    socket.on('disconnect', () => {
      const removeIndex = users.map(user => { return user.id }).indexOf(id)
      users.splice(removeIndex, 1)
      socket.emit('totalUser', users)
      io.emit('leaveRoom', `${name}離開聊天室`)
    })

  })
}

module.exports = { io }
