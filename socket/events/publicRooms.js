const publicUsers = []
module.exports = (io, socket) => {
  const { name, id } = socket.user
  socket.on('joinPublicRoom', async () => {
    try {
      const isUserExists = publicUsers
        .map((user) => user.id)
        .includes(socket.user.id)
      isUserExists ? false : publicUsers.push(socket.user)
      console.log(publicUsers)

      socket.broadcast.emit('announce', {
        publicUsers,
        message: `${name} joined`
      })
    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })

  socket.on('publicMessage', async (msg) => {
    try {
      // chartController.saveMessage({UserId,RoomID,content})
      // mayble let public RoomID === 5
      // io.emit to send an event to everyone
      //socket.emit sending to sender-client onlyt
      return io.emit('chatMessage', msg)
    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })

  socket.on('leavePublicRoom', async () => {
    try {
      publicUsers.splice(publicUsers.indexOf(socket.user), 1)
      io.emit('totalUser', publicUsers)
      return socket.broadcast.emit('announce', {
        publicUsers,
        message: `${name} leaved`
      })
    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })
}
