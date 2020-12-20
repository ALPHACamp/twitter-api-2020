module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`a user connected (id: ${socket.id})`)

    // socket.on('hi', (message) => {
    //   console.log(message)
    // })

    socket.on('chat', (message) => {
      console.log(socket.id, ': ', message)
      io.emit('chat', socket.id, message)
    })

    socket.on('private-message', (anotherSocketId, message) => {
      console.log(`${socket.id} PM ${anotherSocketId}: ${message}`)
      io.to(anotherSocketId).emit('private-message', anotherSocketId, message)
    })
  })
}