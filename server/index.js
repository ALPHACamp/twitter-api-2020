const messageController = require('../controllers/messageController')

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

    // 非同步執行，不知道會不會有渲染順序的問題
    try {
      messageController.getMessages(socket)
    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }

    socket.once('current user', msg => {
      let usersPool = new Map()
      socket.data = { ...msg }

      for (let [id, socket] of io.of('/').sockets) {
        if (usersPool.has(socket.data.user_id)) {
          return
        } else {
          users.push({ ...socket.data })
          usersPool.set(socket.data.user_id, {
            ...socket.data
          })
        }
      }

      socket.emit('users', users)
      socket.broadcast.emit('users', users)
      socket.broadcast.emit('user connected', {
        name: socket.data.name,
        isOnline: 1
      })
    })

    socket.on('chat message', async msg => {
      try {
        const message = {
          id: socket.data.id,
          createdAt: msg.createdAt,
          message: msg.content
        }
        await messageController.saveMessage(socket, msg)

        return socket.emit('chat message', message)

      } catch (error) {
        return socket.emit('error', {
          status: error.name,
          message: error.message
        })
      }
    })

    socket.on('disconnect', reason => {
      socket.broadcast.emit('users', users)
      socket.broadcast.emit('user disconnected', {
        name: socket.data.name,
        isOnline: 0
      })
    })
  })

  // io.engine.on('connection_error', (err, socket) => {
  //   console.log(err.req)     // the request object
  //   console.log(err.code)    // the error code, for example 1
  //   console.log(err.message)  // the error message, for example "Session ID unknown"
  //   console.log(err.context)  // some additional error context
  // })

}