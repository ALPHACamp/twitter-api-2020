const { socketAuthenticated } = require('../middlewares/auth')
const publicRooms = require('./events/publicRooms')
const subscribes = require('./events/subscribes')
const privateRooms = require('./events/privateRooms')

module.exports = (io) => {
  // Store current public users' list
  const publicUsers = []

  io.use(socketAuthenticated).on('connection', (socket) => {
    // io.of("/").sockets and io.engine.clientsCount may be equal
    const clientsCount = io.engine.clientsCount
    const user = socket.user
    console.log(
      ` ${user.name} connected and number of connections ${clientsCount}`
    )

    // Join user room to act as same user with multiple browser tabs
    socket.join(`user-${user.id}`)

    // Add catch-all listener when during development
    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    publicRooms(io, socket, publicUsers)
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
      // Check if user is still in public room user list
      if (publicUsers.indexOf(user)) {
        publicUsers.splice(publicUsers.indexOf(user), 1)

        // Send announce only if the public room still have remained users
        if (publicUsers.length) {
          socket.broadcast.emit('announce', {
            publicUsers,
            message: `${user.name} leaved`
          })
        }
      }

      console.log(publicUsers)
    })
  })
}
