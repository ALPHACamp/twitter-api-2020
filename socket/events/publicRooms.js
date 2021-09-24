const messageService = require('../../services/messageService')
module.exports = (io, socket, publicUsers) => {
  const { name, id } = socket.user
  socket.on('joinPublicRoom', async () => {
    try {
      // Check if user is already in public room
      const isUserExists = publicUsers
        .map((user) => user.id)
        .includes(socket.user.id)
      
      // If user is already exists, joining room without announce
      if (isUserExists) {
        return socket.join('public')
      }
      
      // If user is not exists, pushing to public user list
      isUserExists ? false : publicUsers.push(socket.user)
      console.log(publicUsers)

      // Join public room
      socket.join('public')
      console.log(socket.rooms)
      
      // Send announce to other public room users
      socket.to('public').emit('announce', {
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
      // TODO: add messageService.postMessage({UserId,RoomID = 5 ,content})
      await messageService.postMessage(msg)
      return io.in('public').emit('publicMessage', msg)
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
        return socket.to('public').emit('announce', {
          publicUsers,
          message: `${name} leaved`
        })
      }
    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })
}
