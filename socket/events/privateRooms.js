const messageService = require('../../services/messageService')
const ApiError = require('../../utils/customError')
module.exports = (io, socket) => {
  socket.on('unReadMessage', async (currentUserId) => {
    try {
      // Check if current user has unread messages
      // TODO 1: const unread = await messageService.checkUnreadMessage(currentUserId)
      // TODO 2: return unRead message count
      socket.emit('unReadMessage', { unread })
    } catch (error) {
      console.log(error)
      return socket.emit('error', {
        statusCode: error.statusCode || 400,
        errType: error.errType || 'unReadMessageError',
        message: error.message
      })
    }
  })

  socket.on('joinPrivateRoom', async (msg, callback) => {
    try {
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
    } catch (error) {
      console.log(error)
      return socket.emit('error', {
        statusCode: error.statusCode || 400,
        errType: error.errType || 'joinPrivateRoomError',
        message: error.message
      })
    }
  })

  socket.on('privateMessage', async (msg) => {
    try {
      const { currentUserId, RoomId, content, targetUserId } = msg
      const roomName = socket.user.privateRoom
      
      // current user did not join private room
      if (!roomName) {
        throw new ApiError(
          'privateMessageError',
          400,
          'Current user did not join private room'
        )
      }

      const messageToCreate = { UserId: currentUserId, RoomId, content }

      // check if target user is in room or not
      const sockets = await io.in(roomName).fetchSockets()
      const userIsOnline = sockets.find((client) => {
        return client.user.id === targetUserId
      })

      // set new message reading status base on target user is online or not
      messageToCreate.isRead = userIsOnline

      // create message
      const createdMessage = await messageService.postMessage(messageToCreate)

      // Send message to all the private room user
      const responseMessage = {
        RoomId,
        User: socket.user,
        UserId: socket.user.id,
        content: createdMessage.content,
        createdAt: createdMessage.dataValues.createdAt,
        id: createdMessage.dataValues.id,
        updatedAt: createdMessage.dataValues.updatedAt
      }

      io.in(roomName).emit('privateMessage', responseMessage)

      // Send unread notification
      // TODO: const unread = await messageService.checkUnread(targetUserId) 
      socket.to(`user-${targetUserId}`).emit('unReadMessage', { unread })
    } catch (error) {
      console.log(error)
      return socket.emit('error', {
        statusCode: error.statusCode || 400,
        errType: error.errType || 'privateMessageError',
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
      console.log(error)
      return socket.emit('error', {
        statusCode: error.statusCode || 400,
        errType: error.errType || 'leavePrivateRoomError',
        message: error.message
      })
    }
  })
}
