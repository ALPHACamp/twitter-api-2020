
const db = require('../models')
const User = db.User
const Chat = db.Chat
const Message = db.Message
const Subscribe = db.Subscribe
const Notification = db.Notification
const Reply = db.Reply
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

    // ***
    socket.on('init notification', (userId) => { // 使用者從前端登入時，會 init notification 開始設定 socket 的通知
      socket.join(`${userId}'s channel`) // 加入一個只有自己的 room ，可以收到來自別人按讚、追蹤與回覆的通知

      // 從資料庫找出所有訂閱的人，加入他們的 room ，可以收到來自這些人的推文通知
      Subscribe.findAll({ where: { subscriberId: userId } })
        .then(subscribings => {
          subscribings.forEach(data => {
            socket.join(`subscribe_${data.subscribingId}`)
          })
        })

      // 從資料庫找出所有回覆過的貼文，加入這些貼文的 room ，可以收到來自這些貼文的回覆通知
      Reply.findAll({ where: { UserId: userId } })
        .then(replies => {
          replies.forEach(data => {
            socket.join(`tweet_${data.TweetId}`)
          })
        })
      //
      //
      // room 的名稱可以自己建立不用管前端， ex: socket.join(`tweet_${tweetId}`)
      //
      //
    })
    // ***

    socket.on('tweet notification', (noti) => { // 使用者推文時，會 emit tweet notification 回後端
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
                io.to(`subscribe_${d.senderId}`).emit('get notification', d) // 發送通知給在 subscribe_xx room 裡的人，只有在 room 裡的人收得到來自後端的 emit get notification
              })
            })
        })
    })

    // ***
    socket.on('reply notification', (replies) => { // 使用者回覆別人的推文時，會 emit reply notification 回後端
      console.log(replies)
      // 用前端回傳的該貼文所有回覆，產生一堆通知給回覆過該貼文的人，最後再通知他們
      //
      //
      //
      //
      //
    })
    // ***

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
