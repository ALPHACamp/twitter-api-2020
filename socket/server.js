const jwt = require('jsonwebtoken')
const PUBLIC_ROOM_ID = 1
const messageServices = require('../services/message-service')

// Auth middleware
const authenticatedSocket = (socket, next) => {
  console.log('=== Socket auth ===')

  // Mock socket auth
  socket.handshake.auth.token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyMUBleGFtcGxlLmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJGRTbHBQWWlVMVg2Qm5FL2M2Nm4wZXVpVmU3aVVHZzJrSWVJVmQ2M0c1dllNTzBGQ1JqQVFLIiwibmFtZSI6InVzZXIxIiwiYWNjb3VudCI6InVzZXIxIiwiY292ZXIiOiJodHRwczovL2kuaW1ndXIuY29tL2p1NXdGdDMuanBnIiwiYXZhdGFyIjoiaHR0cHM6Ly9pLmltZ3VyLmNvbS9oQUtjUzNFLmpwZyIsImludHJvZHVjdGlvbiI6bnVsbCwicm9sZSI6InVzZXIiLCJsaWtlZENvdW50IjoyMCwicmVwbGllZENvdW50IjozMCwiZm9sbG93aW5nQ291bnQiOjIsImZvbGxvd2VyQ291bnQiOjEsImNyZWF0ZWRBdCI6IjIwMjItMDMtMDVUMDg6NDE6MDcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMDVUMDg6NDE6MDcuMDAwWiIsImlhdCI6MTY0NjQ3NTM0MCwiZXhwIjoxNjQ3MDgwMTQwfQ.W-pk7OYd-K0p_C25lD-Hnx7ewP5LmITixdrZNpKbrfk'

  if (!socket.handshake.auth.token) throw Error('No socket token!')
  jwt.verify(
    socket.handshake.auth.token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        next(err)
      }
      socket.user = decoded
    }
  )
  next()
}

module.exports = server => {
  const io = require('socket.io')(server)
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
      await messageServices.saveMessages(message, socket.user.id)
      io.to(`${PUBLIC_ROOM_ID}`).emit('send-message', (message, socket.user))
    })

    socket.on('chat message', message => {
      if (message.replace(/\s+/, '') === '')
        throw new Error("message can't be null")
      console.log('message: ' + message)
      console.log(socket.rooms)

      //發送 allMessage事件的訊息給所有連線用戶
      io.emit('chat message', message)
    })

    // user leave room
    socket.on('leave', (userId, roomId) => {})

    socket.on('disconnect', reason => {
      console.log(reason)
      console.log(socket.rooms)
      console.log('Bye~') // 顯示 bye~
    })
  })
}
