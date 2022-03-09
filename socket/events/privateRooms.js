const messageService = require('../../services/messageService')
const ApiError = require('../../utils/customError')
module.exports = (io, socket) => {
  socket.on('unReadMessage', async (currentUserId) => {
    try {
      // Check if current user has unread messages
      const privateUnreadMessageCount =
        await messageService.getPrivateUnreadMessageCount(currentUserId)
      console.log(privateUnreadMessageCount)
      // TODO 1: const unread = await messageService.checkUnreadMessage(currentUserId)
      // TODO 2: return unRead message count
      socket.emit('unReadMessage', { privateUnreadMessageCount })
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
      let privateRoom = await messageService.postPrivateRoom(
        targetUserId,
        currentUserId
      )
      
      console.log('======================================================')
      console.log(privateRoom)
      console.log('======================================================')

      // Set RoomId and roomName due to new private room or existed private room
      let RoomId
      let roomName
      
      // private room is already exists
      if (privateRoom.Room) {
        RoomId = privateRoom.RoomId
        roomName = privateRoom.Room.name
      // a new private room
      } else {
        RoomId = privateRoom.dataValues.id
        roomName = privateRoom.dataValues.name
        io.to(`user-${targetUserId}`).emit('newPrivateRoom', {
          message: `New private room: ${roomName} is created by ${socket.user.name}`
        })
      }

      console.log(roomName, RoomId)

      // Join private room
      socket.join(roomName)

      // Send RoomId back to client
      callback({ RoomId })

      // Set private room name to socket.user
      socket.user.privateRoom = roomName

      console.log(socket.user)
      console.log(socket.rooms)
      // Update unread message status
      await messageService.putMessageIsReadStatus(RoomId, currentUserId)

      // Send new unread message status
      const privateUnreadMessageCount =
        await messageService.getPrivateUnreadMessageCount(currentUserId)
      socket.emit('unReadMessage', { privateUnreadMessageCount })
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
      messageToCreate.isRead = userIsOnline ? true : false
      console.log(messageToCreate)

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
      console.log(`currentUser: ${currentUserId}, targetUser: ${targetUserId}`)
      const privateUnreadMessageCount =
        await messageService.getPrivateUnreadMessageCount(targetUserId)
    
      io.to(`user-${targetUserId}`).emit('unReadMessage', {
        privateUnreadMessageCount
      })
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
