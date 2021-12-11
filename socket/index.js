const session = require('express-session')
const passport = require('passport')

module.exports = server => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      transports: ['websocket', 'polling'],
      credentials: true
    },
    allowEIO3: true
  })
  const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
  io.use(wrap(session({ secret: 'secret', resave: false, saveUninitialized: false })))
  io.use(wrap(passport.initialize()))
  io.use(wrap(passport.session()))

  io.use((socket, next) => {
    if (socket.request.user) {
      next()
    } else {
      next(new Error('unauthorized'))
    }
  })

  // 公開聊天室
  const publicNamespace = io.of('/public')
  publicNamespace.on('connection', socket => {
    console.log('連接成功，上線ID: ', socket.id)
    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    //監聽並提示有人上線了
    socket.on('onlineHint', userName => {
      publicNamespace.emit('onlineHint', userName)
    })

    // 監聽訊息
    socket.on('getMessage', data => {
      console.log('服務端 接收 訊息: ', data)
      // Message.create({
      //   content: data.text,
      //   UserId: data.UserId
      // }).then(message => {
      //   Message.findByPk(message.id, {
      //     include: [User]
      //   }).then(message => {
      //     //回傳 message 給所有客戶端(包含自己)
      //     publicNamespace.emit('getMessage', message)
      //   })
      // })
    })

    //監聽並提示有人下線了
    socket.on('offlineHint', userName => {
      publicNamespace.emit('offlineHint', userName)
    })

    // 連接斷開
    socket.on('disconnect', () => {
      console.log('有人離開了！， 下線ID: ', socket.id)
    })
  })

  // 私人聊天室
  const privateNamespaces = io.of(/(?:user)\d+/)
  privateNamespaces.on('connection', socket => {
    console.log('連接成功，上線ID: ', socket.id)
    console.log('目前連線數量: ', privateNamespaces.sockets.size)
    // 可以在伺服器端顯示通道過來的所有事件，以及相關的參數
    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    //監聽並提示有人上線了
    socket.on('onlineHint', userName => {
      privateNamespace.emit('onlineHint', userName)
    })

    // 監聽訊息
    socket.on('getMessage', data => {
      console.log('服務端 接收 訊息: ', data)
      // Message.create({
      //   content: data.text,
      //   UserId: data.UserId
      // }).then(message => {
      //   Message.findByPk(message.id, {
      //     include: [User]
      //   }).then(message => {
      //     //回傳 message 給所有客戶端(包含自己)
      //     privateNamespace.emit('getMessage', message)
      //   })
      // })
    })

    //監聽並提示有人下線了
    socket.on('offlineHint', userName => {
      privateNamespace.emit('offlineHint', userName)
    })

    // 連接斷開
    socket.on('disconnect', () => {
      console.log('有人離開了！， 下線ID: ', socket.id)
    })
  })
}
