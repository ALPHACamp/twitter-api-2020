const { socketAuthenticated } = require('../middlewares/auth')
const publicRooms = require('./events/publicRooms')
const subscribes = require('./events/subscribes')
const privateRooms = require('./events/privateRooms')

module.exports = (io) => {
  io.use(socketAuthenticated).on('connection', (socket) => {
    // io.of("/").sockets and io.engine.clientsCount may be equal
    const clientsCount = io.engine.clientsCount
    const user = socket.user
    console.log(
      ` ${user.name} connected and number of connections ${clientsCount}`
    )

    // Add catch-all listener when during development
    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    publicRooms(io, socket)
    privateRooms(io, socket)

    // Happened before disconnect
    socket.on('disconnecting', (reason) => {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          socket.to(room).emit('user has left', socket.id)
        }
        console.log(reason)
      }
    })

    socket.on('disconnect', (reason) => {
      console.log(reason)
    })
  })
}
