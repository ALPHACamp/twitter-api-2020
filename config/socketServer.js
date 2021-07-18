const db = require('../models')
const { Message, User } = db
const activeUsers = []
let activeUsersCount = 0
const { socketAuthenticated,getUserInfo } = require('../config/functions')

module.exports = (io) => {
  io.use(socketAuthenticated).on('connection', async socket => {
    try {
      console.log('connection', socket.userId)
      const user = await User.findByPk(socket.userId, {
        attributes: ['id', 'name', 'account', 'avatar', 'role']
      })
      if (user) {
        socket.userId = user.dataValues.id
        socket.user = user.dataValues
        socket.user.socketId = socket.id
        console.log('socket.userId', user.dataValues.id)
        console.log('socket.user', user.dataValues)
        console.log('socket.user.socketId', socket.id)
      }
      console.log('onlineUser', socket.user)
      const onlineUser = socket.user
      if (activeUsers.map(u => u.id).includes(user.id)) {
        console.log('This user already existed.')
        activeUsersCount = activeUsers.length
        return activeUsersCount
      } else {
        activeUsers.push(onlineUser)
        activeUsersCount++
      }
      console.log('activeUsers', activeUsers)
      const activeData = { activeUsersCount, activeUsers }
      console.log('activeData', activeData)
      io.emit('activeUsers', activeData)
      const data = { online: true, onlineUser }
      io.emit('notification', data)

      socket.on('disconnect', async () => {
        if (!socket.user) { return }
        console.log('disconnect', socket.user)
        const offlineUser = socket.user
        const activeUsersIndex = activeUsers.map(u => u.id).indexOf(offlineUser.id)
        activeUsers.splice(activeUsersIndex, 1)
        console.log('activeUsers', activeUsers)
        activeUsersCount = activeUsers.length
        console.log(activeUsersCount)
        const data = { online: false, onlineUser }
        io.emit('notification', data)
        const activeData = { activeUsersCount, activeUsers }
        io.emit('activeUsers', activeData)
      })
      socket.on('sendMessage', async (data) => {
        console.log('sendMessage socket.user', socket.user)
        try {
          if (data) {
            const createdMessage = await Message.create({
              content: data,
              UserId: socket.userId,
              createdAt: Date.now()
            })
            console.log('message: ', createdMessage.toJSON())
            console.log('message content: ', data)
            io.emit('newMessage', { message: createdMessage.toJSON(), user: socket.user })
          }
        } catch (err) { console.log(err) }
      })
    } catch (err) {
      console.log(err)
    }
  })
}
