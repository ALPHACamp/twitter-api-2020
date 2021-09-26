const messageService = require('../../services/messageService')
const socketHelpers = require('../../utils/socketHelpers')
module.exports = (io, socket, publicUsers) => {
  const { name, id } = socket.user
  socket.on('joinPublicRoom', async () => {
    try {
      // Check if user is already in public room
      const isUserExists = publicUsers
        .map((user) => user.id)
        .includes(socket.user.id)

      console.log(
        `${socket.user.name} is already in publicUsers array: ${isUserExists}`
      )

      // Update user's public unread message status
      const updatedUser = await socketHelpers.updateUserLastJoinPublic(
        socket.user.id
      )
      socket.user.lastJoinPublic = updatedUser.dataValues.lastJoinPublic
      const hasUnreadPublicMessage = await socketHelpers.hasUnreadPublicMessage(
        socket.user.lastJoinPublic
      )
      socket.emit('publicUnreadMessage', { hasUnreadPublicMessage })

      // If user is already exists, joining room without announce
      if (isUserExists) {
        console.log(publicUsers)

        socket.join('public')
        // Update new publicUsers to client side
        return io.to('public').emit('publicUsers', publicUsers)
      } else {
        // If user is not exists, pushing to public user list
        publicUsers.push(socket.user)
        console.log(publicUsers)

        // Join public room
        socket.join('public')
        console.log(socket.rooms)

        // Send announce to other public room users
        socket.to('public').emit('announce', {
          content: `${name} joined`
        })

        // Send welcome message to current user
        socket.emit('announce', {
          content: `Welcome, ${name}!`
        })

        // Update new publicUsers to client side
        io.to('public').emit('publicUsers', publicUsers)
      }
    } catch (error) {
      console.log(error)
      return socket.emit('error', {
        statusCode: error.statusCode || 400,
        errType: error.errType || 'joinPublicRoomError',
        message: error.message
      })
    }
  })

  socket.on('publicMessage', async (msg) => {
    try {
      // Add public room id = 5
      msg.RoomId = 5

      // Save message to database
      const message = await messageService.postMessage(msg)

      // Handle response data
      const data = {
        RoomId: msg.RoomId,
        User: socket.user,
        UserId: socket.user.id,
        content: msg.content,
        createdAt: message.dataValues.createdAt,
        id: message.dataValues.id,
        updatedAt: message.dataValues.updatedAt
      }

      // Send unread notification to online users except public room users
      io.except('public').emit('publicUnreadMessage', {
        hasUnreadPublicMessage: true
      })

      // Send public message to public room users
      return io.in('public').emit('publicMessage', data)
    } catch (error) {
      console.log(error)
      return socket.emit('error', {
        statusCode: error.statusCode || 400,
        errType: error.errType || 'publicMessageError',
        message: error.message
      })
    }
  })

  socket.on('leavePublicRoom', async () => {
    try {
      // Check if the same user has multiple client connection
      const sameUserCount = await await io
        .in(`user-${socket.user.id}`)
        .allSockets()
      console.log(sameUserCount)

      console.log(`=====${sameUserCount.size}======`)

      // If current user is the last client connection of the same user
      if (sameUserCount.size === 1) {
        // Remove current user from public user list
        const removedUserIndex = publicUsers.findIndex(
          (user) => user.id === socket.user.id
        )
        publicUsers.splice(removedUserIndex, 1)

        // Leave public room
        socket.leave('public')
        console.log(socket.rooms)

        // Send announce only if the public room still have remained users
        if (publicUsers.length) {
          socket.to('public').emit('announce', {
            content: `${name} leaved`
          })
        }

        // Update new publicUsers to client side
        return io.to('public').emit('publicUsers', publicUsers)
      }

      socket.leave('public')
      // Update new publicUsers to client side
      return io.to('public').emit('publicUsers', publicUsers)
    } catch (error) {
      console.log(error)
      return socket.emit('error', {
        statusCode: error.statusCode || 400,
        errType: error.errType || 'leavePublicRoomError',
        message: error.message
      })
    }
  })
}
