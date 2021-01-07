
const db = require('../models')
const User = db.User
const Chat = db.Chat
const Message = db.Message
const Subscribe = db.Subscribe
const Notification = db.Notification
module.exports = (io) => {
  io.on('connection', socket => {
    console.log('user connected...')

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

    socket.on('init notification', (userId) => {
      socket.join(`${userId}'s channel`)
      Subscribe.findAll({ where: { subscriberId: userId } })
        .then(subscribings => {
          subscribings.forEach(data => {
            socket.join(`subscribe_${data.subscribingId}`)
          })
        })
    })

    socket.on('tweet notification', (noti) => {
      Subscribe.findAll({ where: { subscribingId: noti.senderId } })
        .then(subscribers => {
          const promises = subscribers.map((data) => {
            return Notification.create({
              senderId: noti.senderId,
              titleData: noti.titleData,
              contentData: noti.contentData,
              recipientId: data.subscriberId,
              url: noti.url,
              type: noti.type
            })
          })
          Promise.all(promises)
            .then(data => {
              data.forEach(d => {
                io.to(`subscribe_${d.senderId}`).emit('get notification', d)
              })
            })
        })
    })

    socket.on('personal notification', (noti) => {
      Notification.create({
        senderId: noti.senderId,
        titleData: noti.titleData,
        contentData: noti.contentData,
        recipientId: noti.recipientId,
        url: noti.url,
        type: noti.type
      })
        .then(data => {
          io.to(`${noti.recipientId}'s channel`).emit('get notification', data)
        })
    })

    socket.on('leave', (id) => {
      console.log('user disconnected')
    })
  })
}
