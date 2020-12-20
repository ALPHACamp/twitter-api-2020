const passport = require('../config/passport')



function authenticated(socket, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) return next(error)
    if (!user) return next(new Error('未被授權'))
    if (user.role === 'admin') return next(new Error('未被授權'))
    socket.request.user = user
    return next()
  })(socket.request, {}, next)
}


module.exports = (io) => {
  io.use(authenticated)

  io.on('connection', (socket) => {
    console.log(`a user connected (id: ${socket.id})`)

    socket.on('public-message', (message) => {
      console.log(socket.id, ': ', message)
      io.emit('public-message', socket.id, message)
    })

    socket.on('private-message', (anotherSocketId, message) => {
      console.log(`${socket.id} PM ${anotherSocketId}: ${message}`)
      io.to(anotherSocketId).emit('private-message', anotherSocketId, message)
    })
  })

}