const express = require('express')
const app = express()

const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:8080', 'https://r05323045.github.io'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
})

let onlineCount = 0

io.on('connection', socket => {
  console.log('user connected...')

  onlineCount++

  socket.on('send message', (msg) => {
    const USERID = msg.UserId
    return Promise.all([
      Message.create({
        UserId: USERID,
        message: msg.message,
        targetChannel: '0',
        type: msg.type,
        sencTo: 0
      })
    ])
      .then(
        socket.broadcast.emit('msg', msg),
        socket.emit('msg', msg)
      ).catch(error => {
        console.log(error)
      })
  })

  socket.on('private chatroom', (channel) => {
    socket.join(channel)
  })
  socket.on('leave private chatroom', (channel) => {
    socket.leave(channel)
  })

  socket.on('private message', (msg) => {
    socket.broadcast.emit('unread_msg', msg)
    const USERID = msg.UserId
    return Promise.all([
      Message.create({
        UserId: USERID,
        message: msg.message,
        targetChannel: msg.targetChannel,
        type: msg.type,
        sendTo: msg.sendTo
      })
    ])
      .then(
        socket.join(msg.targetChannel),
        io.to(msg.targetChannel).emit('private_msg', msg)
      ).catch(error => {
        console.log(error)
      })
  })

  socket.on('chatting', (user) => {
    return Promise.all([
      Message.create({
        UserId: user.id,
        message: `${user.name} 上線`,
        targetChannel: '0',
        type: 'userComein',
        sendTo: 0
      })
    ])
      .then(data => {
        socket.broadcast.emit('newclientlogin', { ...user, message: `${user.name} 上線` })
        User.findByPk(user.id)
          .then((user) => {
            const USERID = user.id
            return Promise.all([
              Chat.findAll({ include: [User] }),
              Chat.findOne({ where: { UserId: USERID } })
            ])
              .then(([chatters, chat]) => {
                socket.emit('userOnline', chatters)
                if (!chat) {
                  Chat.create({
                    UserId: USERID
                  })
                } else {
                  console.log('使用者已經在線上')
                }
              }).catch((err) => {
                console.log(err)
              })
          })
      }).catch(error => {
        console.log(error)
      })
  })

  socket.on('leave', (id) => {
    console.log('user disconnected')
    onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1
    io.sockets.emit('exit', onlineCount + ' user leave')
  })
})

http.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))
