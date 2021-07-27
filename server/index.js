const subscribe = require('./modules/subscribe')
const publicChat = require('./modules/publicChat')
const privateChat = require('./modules/privateChat')

const subscriptionService = require('../services/subscriptionService')

module.exports = (server) => {
  const users = new Map()

  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    pingTimeout: 30000,
    rejectUnauthorized: false,
    maxHttpBufferSize: 100000000
  })

  io.on('connection', async socket => {
    console.log('A user connecting')
    console.log('目前連線數量: ', io.of("/").sockets.size)

    // 可以在伺服器端顯示通道過來的所有事件，以及相關的參數
    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    socket.on('currentUser', async msg => {
      try {
        socket.data = { ...msg }
        const data = {
          userSocketId: socket.id, ...socket.data
        }

        if (!users.has(socket.data.id)) {
          socket.broadcast.emit('userConnected', {
            name: socket.data.name,
            isOnline: 1
          })
        }

        users.set(socket.data.id, data)

        // 多網頁連接同帳號判斷
        socket.join(`user${socket.data.id}`)
        // 進入訂閱的頻道s
        const channels = await subscriptionService.getChannels(msg.id)
        socket.join(channels)

        io.emit('users', [...users.values()])
      } catch (error) {
        console.error(error)
        return socket.emit('error', {
          status: error.name,
          message: error.message
        })
      }

    })

    subscribe(io, socket)
    privateChat(io, socket)
    publicChat(io, socket, users)

    socket.on('disconnect', async reason => {
      console.log(reason)
      const matchingSockets = await io.in(`user${socket.data.id}`).allSockets()
      const isDisconnected = matchingSockets.size === 0

      if (isDisconnected) {
        users.delete(socket.data.id)

        socket.broadcast.emit('userDisconnected', {
          name: socket.data.name,
          isOnline: 0
        })

        io.emit('users', [...users.values()])
      }
    })
  })

  // io.engine.on('connection_error', (err, socket) => {
  //   console.log(err.req)     // the request object
  //   console.log(err.code)    // the error code, for example 1
  //   console.log(err.message)  // the error message, for example "Session ID unknown"
  //   console.log(err.context)  // some additional error context
  // })
}
