const { socketAuthenticated } = require('../middlewares/auth')
const publicRooms = require('./events/publicRooms')
const subscribes = require('./events/subscribes')
const privateRooms = require('./events/privateRooms')
const messageService = require('../services/messageService')

// Store current public users' list
const publicUsers = []

module.exports = (io) => {
  io.use(socketAuthenticated).on('connection', async (socket) => {
    // io.of("/").sockets and io.engine.clientsCount may be equal
    const clientsCount = io.engine.clientsCount
    const user = socket.user
    console.log(
      ` ${user.name} connected and number of connections ${clientsCount}`
    )

    // Check if current user has private unread messages
    const privateUnreadMessageCount =
      await messageService.getPrivateUnreadMessageCount(user.id)
    socket.emit('unReadMessage', { privateUnreadMessageCount })

    // Check if current user has public unread messages
    const publicMessages = await messageService.getMessages(5)
    const lastMessagesCreatedAt = publicMessages[publicMessages.length - 1].createdAt
    const hasUnreadPublicMessage = lastMessagesCreatedAt > socket.user.lastLogin
    console.log(hasUnreadPublicMessage)

    if (hasUnreadPublicMessage) {
      socket.emit('publicUnreadMessage', { hasUnreadPublicMessage })
    }
    
    // Join user room to act as same user with multiple browser tabs
    socket.join(`user-${user.id}`)

    // Add catch-all listener when during development
    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    publicRooms(io, socket, publicUsers)
    privateRooms(io, socket)

    socket.on('disconnect', async (reason) => {
      console.log(reason)
      // Check if the same user has multiple client connection
      const sameUserCount = await io.in(`user-${socket.user.id}`).allSockets()

      console.log(`=====${sameUserCount.size}======`)
      if (sameUserCount.size === 0) {
        // Check if user is still in public room user list
        const removedUserIndex = publicUsers.findIndex(
          (user) => user.id === socket.user.id
        )
        console.log(removedUserIndex)

        if (removedUserIndex !== -1) {
          publicUsers.splice(removedUserIndex, 1)

          // Send announce only if the public room still have remained users
          if (publicUsers.length) {
            socket.to('public').emit('announce', {
              content: `${user.name} leaved`
            })
          }

          // Update new publicUsers to client side
          io.to('public').emit('publicUsers', publicUsers)
        }

        socket.leave('public')
      }
      // Update new publicUsers to client side
      io.to('public').emit('publicUsers', publicUsers)
      console.log(publicUsers)
    })
  })
}
