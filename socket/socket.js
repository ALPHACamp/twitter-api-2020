const sockets = []
const userSockets = {}
const socketController = require('../controllers/socket/socketController')

module.exports = (server) => {
  const io = require('socket.io')(server)


  io.on('connection', (socket) => {
    /* connect */
    console.log(`User is online: ${socket.id}`)
    socket.emit('message', `Your socket id is  ${socket.id}`)
    socket.on('sendMessage', (data) => console.log(data))
    /* disconnect */
    socket.on('disconnect', () => {
      console.log(`User is offline: ${socket.id}`)
    })

    /* join public room */
    socket.on('join-public-room',
      io.emit('new-join', socketController.joinPublicRoom)
    )

    /* get public history */
    socket.on('get-public-history', socketController.getPublicHistory)

    /* public message */
    socket.on('post-public-msg',
      socket.broadcast.emit('get-public-msg',
        socketController.postPublicMsg)
    )
  })

}