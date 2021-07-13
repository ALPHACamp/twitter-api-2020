const { Server } = require('socket.io')

const { socketAuth } = require('../middlewares/auth')

const wrap = middleware => {
  return (socket, next) => middleware(socket.request, {}, next)
}

module.exports = (server) => {
  const io = new Server(server, {
      cors: {
      origin: process.env.CORS_WHITE_LIST.split(','),
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('A user connected')
    console.log(io.engine.clientsCount)
    
    io.use(socketAuth).emit('connection', io.engine.clientsCount)
    const announce = `User ${socket.id} joined the public room.`
    socket.broadcast.emit('announce', announce, io.engine.clientsCount)
    socket.on('chat message', (message) => {
      const token = socket.token
      message = `${socket.id}: ${message} ${token}`
      io.emit('chat message', message)
    })
    socket.on('disconnect', (reason) => {
      console.log(`${socket.id} is leaving.`)
    })
  })
}
