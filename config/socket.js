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


  let users = {}
  io.on('connection', (socket) => {
    const { name, id } = socket.handshake.user
    // console.log(socket)
    // console.log('socket.id', socket.id)
    // const rooms = io.of("/").adapter.rooms;
    // const sids = io.of("/").adapter.sids;
    // console.log('-----------------')
    // console.log(id)
    // console.log(socket.adapter.rooms)
    // io.of("/").adapter.on("create-room", (room) => {
    //   console.log(`room ${room} was created`);
    // })

    // io.of("/").adapter.on("join-room", (room, id) => {
    //   console.log(`${name}已加入房間${room} `);
    // })
    socket.on('user', (data) => {
      users = data
      socket.broadcast.emit('chat message', `${name}上線`);
    })
    socket.on('chat message', async (msg) => {
      await Chat.create({
        UserId: id,
        message: msg.content,
        ChatroomId: 5
      })
      io.emit('chat message', `${name}: ${msg.content}`);
    });
    socket.on('disconnect', () => {
      io.emit('chat message', `${name}離開聊天室`)
    })


    // socket.on('private message', async (anotherSocketId, msg) => {
    // await Chat.create({
    //   UserId: users.UserId,
    //   message: msg,
    //   ChatroomId: users.ChatroomId
    // })
    //   io.emit('private message', socket.id, `${socket.id}: ${msg}`);
    // });

  })
}

module.exports = { io }