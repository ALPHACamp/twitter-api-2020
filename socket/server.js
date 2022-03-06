const PUBLIC_ROOM_ID = 1
const messageServices = require('../services/message-service')
const { generateMessage } = require('../helpers/message')
const { authenticatedSocket } = require('../helpers/auth')


module.exports = server => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
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

      //如果是公開聊天室
      if (roomId === PUBLIC_ROOM_ID) {
        io.to(`${PUBLIC_ROOM_ID}`).emit('join', {
          message: `${socket.user.name}上線`,
          type: 'notice'
        })
      }
    })

    socket.on('public-chat', async message => {
      console.log('receive public chat message')
      io.to(`${PUBLIC_ROOM_ID}`).emit('send-message', (message, socket.user))
      await messageServices.saveMessages(generateMessage(PUBLIC_ROOM_ID, message, socket.user, 'message'))
    })

    socket.on('chat message', async message => {
      if (message.replace(/\s+/, '') === '')
        throw new Error("message can't be null")
      console.log('message: ' + message)

      //發送 allMessage事件的訊息給所有連線用戶
      io.emit('chat message', message)
      await messageServices.saveMessages(generateMessage(PUBLIC_ROOM_ID, message, socket.user, 'message'))
    })

    socket.on('disconnect', reason => {
      console.log(reason)
      console.log(socket.rooms)
      console.log('Bye~') // 顯示 bye~
    })
  })
}
