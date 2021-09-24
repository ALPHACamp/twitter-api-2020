module.exports = (io, socket) => {
  socket.on('unReadMessage', async (currentUserId) => {
    // Check if current user has unread messages
    // TODO 1: const unread = await messageService.checkUnread(currentUserId)
    // TODO 2: return unRead message count
    socket.emit('unReadMessage', { unread })
  })

  socket.on('joinPrivateRoom', async (targetUserId, currentUserId) => {
    // Create if room can't be found
    //TODO 1: messageService.getPrivateRooms(targetUserId, currentUserId) to get member and room
    //TODO 2: if room does not exists, messageService.postPrivateRoom(targetUserId, currentUserId) to post new private room
    //TODO 3: messageService.postMember(room, targetUserId, currentUserId) to add room member

    // If room can be found
    socket.join(Room.name)

    // Update unread message status
    // TODO : messageService.updateMessageStatus(room.id, currentUserId)


  })

  socket.on('privateMessage', async (msg, targetUserId) => {
    try {
      // Frontend : return Room name = targetUserId-currentUserId
      // TODO: add messageService.postMessage({UserId, RoomId, content})

      // check if target user is in room or not
      const privateRoomUsers = io.sockets.adapter.rooms.get(Room.name)
      // if not, send unread notification
      // const unread = await messageService.checkUnread(targetUserId)
      // TODO: find a way to change targetUserId to socketId
      socket.to(`user-${targetUserId}`).emit('unReadMessage', { unread })

      // Send message to all the private room user
      return socket.to(Room.name).emit('privateMessage', msg)
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
