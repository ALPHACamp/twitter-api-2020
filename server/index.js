const messageService = require('../services/messageService')
const { generateRoomName, SearchListenerOnline, checkIsInRoom } = require('../libs/utility')

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
    console.log(io.of("/").sockets.size)

    // 可以在伺服器端顯示通道過來的所有事件，以及相關的參數
    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    socket.on('currentUser', async msg => {
      try {
        socket.data = { ...msg }

        const data = {
          ...socket.data
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

        io.emit('users', [...users.values()])
      } catch (error) {
        console.error(error)
        return socket.emit('error', {
          status: error.name,
          message: error.message
        })
      }

    })

    // 未讀通知
    socket.on('messageNotify', async msg => {
      try {
        const unReads = await messageService.searchUnread(io, socket, msg)

        socket.emit('messageNotify', unReads)

      } catch (error) {
        return socket.emit('error', {
          status: error.name,
          message: error.message
        })
      }
    })

    // 進入房間
    socket.on('enterRoom', async msg => {
      try {
        const { id, listenerId } = msg
        let roomName = generateRoomName(id, listenerId)
        socket.join(roomName)
        console.log('===========roomName===========', roomName)

        await messageService.createPrivateRoom(id, listenerId, roomName)

        // 先清空 => 後搜尋未讀
        await messageService.clearUnread(io, socket, msg)
        const unReads = await messageService.searchUnread(io, socket, msg)

        socket.emit('messageNotify', unReads)
      } catch (error) {
        console.log(error)
        return socket.emit('error', {
          status: error.name,
          message: error.message
        })
      }
    })

    // 離開房間
    socket.on('leaveRoom', async msg => {
      try {
        const { id, listenerId } = msg
        let roomName = generateRoomName(id, listenerId)

        socket.leave(roomName)

      } catch (error) {
        return socket.emit('error', {
          status: error.name,
          message: error.message
        })
      }
    })

    // 1on1私聊
    socket.on('privateMessage', async msg => {
      try {
        const { id, listenerId } = msg
        const roomName = generateRoomName(id, listenerId)
        // 找到房間內所有連線
        const clients = io.sockets.adapter.rooms.get(roomName)
        console.log(clients)

        if (!clients) {
          console.log('No clients in room')
          return
        }

        const { isOnline, listenerSocketId } = SearchListenerOnline(io, socket, clients, listenerId)
        console.log(`===========isOnline=============`, isOnline,'listenerSocketid: ', listenerSocketId)


        if (isOnline) {
          if (checkIsInRoom(io, socket, clients, listenerSocketId)) {
            console.log('====對方在房間====')
            msg.isInRoom = true

            const message = await messageService.saveMessage(msg)

            io.to(roomName).emit('privateMessage', message)
          } else {
            console.log('====對方不在房間====')

            msg.isInRoom = false

            const [message, unReads] = await Promise.all([
              messageService.saveMessage(msg),
              messageService.searchUnread(io, socket, msg)
            ])

            socket.to(listenerSocketId).emit('messageNotify', unReads)
            io.to(roomName).emit('privateMessage', message)
          }
        } else {
          msg.isInRoom = false
          const message = await messageService.saveMessage(msg)
          io.to(roomName).emit('privateMessage', message)
        }

      } catch (error) {
        console.log(error)
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

    // 離開公開聊天室事件
    socket.on('leavePublic', async msg => {
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
