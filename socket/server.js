const jwt = require('jsonwebtoken')
const PUBLIC_ROOM_ID = 1
const messageServices = require('../services/message-service')

// Auth middleware
const authenticatedSocket = (socket, next) => {
  console.log('=== Socket auth ===')

  // Mock socket auth
  socket.handshake.auth.token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyMUBleGFtcGxlLmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJFBYZnBDQTJpRDhMY2tRNm91MTZ5Vy50VW1iaHM2S05iMEE5MEJRVXV0a1lxTkF1em5NN3pHIiwibmFtZSI6InVzZXIxIiwiYWNjb3VudCI6InVzZXIxIiwiY292ZXIiOiJodHRwczovL2kuaW1ndXIuY29tL2p1NXdGdDMuanBnIiwiYXZhdGFyIjoiaHR0cHM6Ly9pLmltZ3VyLmNvbS9oQUtjUzNFLmpwZyIsImludHJvZHVjdGlvbiI6bnVsbCwicm9sZSI6InVzZXIiLCJsaWtlZENvdW50IjoyMCwicmVwbGllZENvdW50IjozMCwiZm9sbG93aW5nQ291bnQiOjIsImZvbGxvd2VyQ291bnQiOjEsImNyZWF0ZWRBdCI6IjIwMjItMDMtMDVUMDk6MTM6NDUuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMDVUMDk6MTM6NDUuMDAwWiIsImlhdCI6MTY0NjQ3MTY1NiwiZXhwIjoxNjQ3MDc2NDU2fQ.HWkNJTFm7LRiAWTtZA2FBO2E4jZkstbNW6Vi_n6c5wc'

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
      console.log(roomId)
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
      await messageServices.saveMessages(message, socket.user.id)
      io.to(`${PUBLIC_ROOM_ID}`).emit('send-message', (message, socket.user))
    })

    socket.on('chat message', message => {
      if (message.replace(/\s+/, '') === '')
        throw new Error("message can't be null")
      console.log('message: ' + message)
      console.log(socket.user)

      //發送 allMessage事件的訊息給所有連線用戶
      io.emit('chat message', message)
    })

    socket.on('disconnect', reason => {
      console.log(reason)
      console.log(socket.rooms)
      console.log('Bye~') // 顯示 bye~
    })
  })
}
