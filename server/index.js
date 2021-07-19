const messageService = require('../services/messageService')
const { generateRoomName, SearchListenerOnline, checkIsInRoom } = require('../libs/utility')

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

    // 進入私聊介面
    socket.on('enterPrivateInterface', async msg => {
      try {
        const chattedUsers = await messageService.getChattedUsers(io, socket, msg)

        socket.emit('chattedUsers', chattedUsers)
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
        // 加入房間
        socket.join(roomName)

        // 先清空 => 後搜尋未讀
        await messageService.clearUnread(io, socket, msg)
        const unReads = await messageService.searchUnread(io, socket, msg)

        socket.emit('messageNotify', unReads)
      } catch (error) {
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
        const clients = io.sockets.adapter.rooms.get(roomName)

        if (!clients) {
          console.log('No clients in room')
          return
        }

        const { isOnline, listenerSocketId } = SearchListenerOnline(io, socket, clients, listenerId)


        if (isOnline) {
          if (checkIsInRoom(io, socket, clients, listenerId)) {
            msg.isInRoom = true

            const message = await messageService.saveMessage(msg)

            io.to(roomName).emit('privateMessage', message)
          } else {
            msg.isInRoom = false

            const [message, unReads] = await Promise.all([
              messageService.saveMessage(msg),
              messageService.searchUnread(io, socket, msg)
            ])

            socket.to(listenerSocketId).emit('messageNotify', unReads)
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

    socket.on('getMessages', msg => {
      let usersPool = new Map()
      socket.data = { ...msg }

      for (let [id, socket] of io.of('/').sockets) {
        const data = {
          userSocketId: id, ...socket.data
        }

        if (usersPool.has(socket.data.id)) {
          continue
        } else if (!socket.data.id) {
          continue
        } else {
          users.push(data)
          usersPool.set(socket.data.id, data)
        }
      }

      io.emit('users', users)
    })

    socket.on('currentUser', async msg => {
      try {
        let usersPool = new Map()
        socket.data = { ...msg }

        for (let [id, socket] of io.of('/').sockets) {
          const data = {
            userSocketId: id, ...socket.data
          }

          if (usersPool.has(socket.data.id)) {
            continue
          } else if (!socket.data.id) {
            continue
          } else {
            users.push(data)
            usersPool.set(socket.data.id, data)
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
  })

  // io.engine.on('connection_error', (err, socket) => {
  //   console.log(err.req)     // the request object
  //   console.log(err.code)    // the error code, for example 1
  //   console.log(err.message)  // the error message, for example "Session ID unknown"
  //   console.log(err.context)  // some additional error context
  // })
}
