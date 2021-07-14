const { Server } = require('socket.io')

const { socketAuth } = require('../middlewares/auth')

module.exports = (server) => {
  const io = new Server(server, {
      cors: {
      origin: process.env.CORS_WHITE_LIST.split(','),
      methods: ['GET', 'POST']
    }
  })

  io.use(socketAuth)

  io.on('connection', (socket) => {
    console.log('A user connected')
    console.log(io.engine.clientsCount)
    
    io.emit('connection', io.engine.clientsCount)
    const announce = `User ${socket.id} joined the public room.`
    socket.broadcast.emit('announce', announce, io.engine.clientsCount)
    socket.on('chat message', (message) => {
      message = `${socket.user.name}: ${message}`
      socket.broadcast.emit('chat message', message, socket.user)
    })
    socket.on('disconnect', (reason) => {
      console.log(`${socket.id} is leaving.`)
    })
  })
}
