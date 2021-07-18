const db = require('../models')
const { Message, User } = db
const activeUsers = []
let activeUsersCount = 0
const { socketAuthenticated } = require('../config/functions')

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
      // 線上使用者列表加入新使用者的資料
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
      // 發送線上使用者列表//發送上線人數
      io.emit('activeUsers', activeData)
      // 向聊天室廣播新的使用者上線
      const data = { online: true, onlineUser }
      io.emit('notification', data)

      socket.on('disconnect', async () => {
      // emit使用者離線通知
        if (!socket.user) { return }
        console.log('disconnect', socket.user)
        const offlineUser = socket.user
        // 線上使用者列表移除離線使用者資料
        const activeUsersIndex = activeUsers.map(u => u.id).indexOf(offlineUser.id)
        activeUsers.splice(activeUsersIndex, 1)
        console.log('activeUsers', activeUsers)
        activeUsersCount = activeUsers.length
        console.log(activeUsersCount)
        const data = { online: false, onlineUser }
        // 聊天室通知該名使用者離開聊天
        io.emit('notification', data)
        // 發送線上使用者列表
        const activeData = { activeUsersCount, activeUsers }
        io.emit('activeUsers', activeData)
      })
      // api發送歷史訊息(avatar id account name messages)
      // on監聽使用者發送的訊息//儲存訊息到db//emit發送使用者的訊息到聊天室
      socket.on('sendMessage', async (data) => {
        console.log('sendMessage socket.user', socket.user)
        try {
          if (data) {
            const createdMessage = await Message.create({
              content: data,
              UserId: socket.userId,
              createdAt: Date.now()
            })
            // 傳送使用者和訊息
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
