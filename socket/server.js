const PUBLIC_ROOM_ID = 1
const messageServices = require('../services/message-service')
const notificationController = require('../controllers/notification-controller')
const { generateMessage } = require('../helpers/message')
const { authenticatedSocket } = require('../helpers/auth')

module.exports = server => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  io.use(authenticatedSocket).on('connection', socket => {
    console.log('---user connected---')
    console.log('目前連線數量: ', socket.server.engine.clientsCount)
    console.log(`新 user: ${socket.user.account} 加入`)

    //顯示通道過來的所有事件，以及相關的參數
    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    socket.on('join', ({ roomId }) => {
      roomId = Number(roomId)
      socket.join(`${roomId}`)
      io.emit('test message', '後端 test 123，收到請回答')
      console.log(socket.rooms)

      //如果是公開聊天室
      if (roomId === PUBLIC_ROOM_ID) {
        socket.broadcast.to(`${PUBLIC_ROOM_ID}`).emit('join', {
          message: `${socket.user.name}上線`,
          type: 'notice'
        })
        console.log(`@${socket.user.account}加入公開聊天室`)
      }
    })

    socket.on('public-chat', async message => {
      console.log('public chat: ' + message)
      console.log('receive public chat message')
      io.to(`${PUBLIC_ROOM_ID}`).emit('send-message', (message, socket.user))
      await messageServices.saveMessages(
        generateMessage(PUBLIC_ROOM_ID, message, socket.user, 'message')
      )
    })

    socket.on('private-chat', async message => {
      console.log('receive private chat message')
      await socketService.saveMessages(
        generateMessage(message.roomId, message, socket.user, 'message')
        )
      io.to(`${message.roomId}`).emit('send-message', (message, socket.user))
    })

    socket.on('chat message', async message => {
      if (message.replace(/\s+/, '') === '')
        throw new Error("message can't be null")
      console.log('message: ' + message)

      //發送 allMessage事件的訊息給所有連線用戶
      io.emit('chat message', message)
      await messageServices.saveMessages(
        generateMessage(PUBLIC_ROOM_ID, message, socket.user, 'message')
      )
    })

    // Subscription to target account
    socket.on('suscription', account => {
      console.log(account)
      socket.join(account)
      console.log(socket.rooms)
    })

    // Notification
    socket.on('notification', async type => {
      await notificationController.saveNotification(socket.user.id, type)
      socket.broadcast.to(socket.user.account).emit('notification')
    })

    socket.on('disconnect', reason => {
      console.log(reason)
      console.log(socket.rooms)
      console.log('Bye~') // 顯示 bye~
    })
  })
}
