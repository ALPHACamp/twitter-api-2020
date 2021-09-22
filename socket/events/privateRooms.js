module.exports = (io, socket) => {
  socket.on('joinPrivateRoom', async (targetUserId, currentUserId) => {
    // messageController.getPrivateRoom (currentUserId) : return member and room
    // const Room name = targetUserId-currentUserId
    // Create if room can't be found : messageController.createRoom(name) and createMember

    socket.join(Room.name)
  })

  socket.on('privateMessage', async (msg, targetUserId) => {
    try {
      // Frontend : return Room name = targetUserId-currentUserId
      // messageController.saveMessage({UserId,RoomID,content})
      return socket.to(Room.name).emit('chatMessage', msg)
    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })

  socket.on('leavePrivateRoom', async () => {
    try {
      return socket.leave(Room.name)
    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })
}
