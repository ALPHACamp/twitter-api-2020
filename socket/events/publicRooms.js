module.exports = (io, socket, publicUsers) => {
  const { name, id } = socket.user
  socket.on('joinPublicRoom', async () => {
    try {
      // TODO : add chatService for getting public room history message 

      // Add current user to public user list
      const isUserExists = publicUsers
        .map((user) => user.id)
        .includes(socket.user.id)
      isUserExists ? false : publicUsers.push(socket.user)
      console.log(publicUsers)
      
      // Send announce to other public room users
      socket.broadcast.emit('announce', {
        publicUsers,
        message: `${name} joined`
      })
      
      // Send welcome message to current user
      socket.emit('announce', {
        publicUsers,
        message: `Welcome, ${name}!`
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
      return io.emit('publicMessage', msg)
    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })

  socket.on('leavePublicRoom', async () => {
    try {
      // Remove current user from public user list
      publicUsers.splice(publicUsers.indexOf(socket.user), 1)
      
      // Send announce only if the public room still have remained users
      if (publicUsers.length) {
        return socket.broadcast.emit('announce', {
          publicUsers,
          message: `${name} leaved`
        })
      }
      
      // Return public user list
      return io.emit('totalUser', publicUsers)
    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })
}
