const messageService = require('../services/messageService')

module.exports = (server) => {

  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', async socket => {
    console.log('A user connecting')
    console.log(socket.handshake.headers.host)
    console.log(socket.handshake.url)
    console.log(io.of("/").sockets.size)

    // 可以在伺服器端顯示通道過來的所有事件，以及相關的參數
    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    const users = []

    socket.on('currentUser', async msg => {
      try {
        let usersPool = new Map()
        socket.data = { ...msg }

        for (let [id, socket] of io.of('/').sockets) {
          if (usersPool.has(socket.data.user_id)) {
            continue
          } else if (!socket.data.id) {
            continue
          } else {
            users.push({ ...socket.data })
            usersPool.set(socket.data.user_id, {
              ...socket.data
            })
          }
        }

        socket.broadcast.emit('userConnected', {
          name: socket.data.name,
          isOnline: 1
        })

        io.emit('users', users)
      } catch (error) {
        console.error(error)
        return socket.emit('error', {
          status: error.name,
          message: error.message
        })
      }

    })

    socket.on('chatMessage', async msg => {
      try {
        const message = await messageService.saveMessage(msg)

        return io.emit('chatMessage', message)

      } catch (error) {
        return socket.emit('error', {
          status: error.name,
          message: error.message
        })
      }
    })

    socket.on('disconnect', reason => {
      socket.broadcast.emit('userDisconnected', {
        name: socket.data.name,
        isOnline: 0
      })
      socket.broadcast.emit('users', users)
    })

    try {
      const msg = await messageService.getMessages(socket)
      socket.emit('getMessages', msg)
    } catch (error) {
      console.error(error)
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })

  // io.engine.on('connection_error', (err, socket) => {
  //   console.log(err.req)     // the request object
  //   console.log(err.code)    // the error code, for example 1
  //   console.log(err.message)  // the error message, for example "Session ID unknown"
  //   console.log(err.context)  // some additional error context
  // })
}
