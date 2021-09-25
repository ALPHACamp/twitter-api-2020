const messageService = require('../../services/messageService')
module.exports = (io, socket) => {
  socket.on('unReadMessage', async (currentUserId) => {
    // Check if current user has unread messages
    // TODO 1: const unread = await messageService.checkUnreadMessage(currentUserId)
    // TODO 2: return unRead message count
    socket.emit('unReadMessage', { unread })
  })

  socket.on('joinPrivateRoom', async (msg, callback) => {
    // Find or create if private room can't be found
    const { targetUserId, currentUserId } = msg
    const privateRoom = await messageService.postPrivateRoom(
      targetUserId,
      currentUserId
    )

    console.log(privateRoom)

    // Join private room
    socket.join(privateRoom.name)

    // Send RoomId back to client
    callback({ RoomId: privateRoom.id })

    // Set private room name to socket.user
    socket.user.privateRoom = privateRoom.name

    // Update unread message status
    // TODO : messageService.updateMessageStatus(room.id, currentUserId)

    // Send new unread message status
    // TODO : messageService.checkUnreadMessage(currentUserId)
    // TODO : socket.emit('unReadMessage')
  })

  socket.on('privateMessage', async (msg) => {
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
      // If user is in private room, leave private room
      if (socket.user.privateRoom) {
        socket.leave(socket.user.privateRoom)
        console.log(socket.rooms)
      }
    } catch (error) {
      return socket.emit('error', {
        status: error.name,
        message: error.message
      })
    }
  })
}
