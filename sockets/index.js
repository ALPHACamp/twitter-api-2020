const passport = require('../config/passport')
const { User, Sequelize } = require('../models')
const { Op } = Sequelize
const userSelectedFields = ['id', 'account', 'name', 'avatar']

//functions
function authenticated(socket, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) return next(error)
    if (!user) return next(new Error('未被授權'))
    if (user.role === 'admin') return next(new Error('未被授權'))
    socket.request.user = user
    return next()
  })(socket.request, {}, next)
}

async function getConnectedUsers(socket, rooms) {
  try {
    const connectedUserIds = []
    rooms.forEach((_, key) => {
      if (Number(key) && key !== socket.request.user.id) {
        connectedUserIds.push(key)
      }
    })
    const connectedUsers = await User.findAll({
      where: { id: { [Op.in]: connectedUserIds } },
      attributes: userSelectedFields,
      raw: true
    })
    socket.emit('update-connected-users', connectedUsers)
    // console.log('updated-connected-users: ', connectedUsers)
  } catch (error) {
    socket.emit('error', '更新在線使用者時發生錯誤')
  }
}

module.exports = (io) => {
  io.use(authenticated)

  io.on('connection', async (socket) => {
    const { id, account, name, avatar } = socket.request.user
    const sender = { id, account, name, avatar }

    console.log(`a user connected (userId: ${id} name: ${name})`)

    //用user id 建立room, 將訊息推到使用者透過不同裝置、頁簽的連線
    socket.join(id)

    //回傳目前在線的使用者資料(排除自己)
    getConnectedUsers(socket, io.sockets.adapter.rooms)
    socket.on('disconnect', async () => {
      getConnectedUsers(socket, io.sockets.adapter.rooms)
    })

    //發訊息給所有人(public聊天室)
    socket.on('public-message', (message, timestamp) => {
      io.emit('public-message', sender, message, timestamp)
      console.log(`${name} to everyone: ${message}`)
    })
    //私訊
    socket.on('private-message', async (userId, message, timestamp) => {
      try {
        userId = Number(userId)
        if (!Number(userId)) return socket.emit('error', '使用者編號無效')
        const recipient = await User.findByPk(userId, { attributes: userSelectedFields })
        if (!recipient) return socket.emit('error', '查無此使用者編號')
        io.to(userId).emit('private-message', sender, message, timestamp)
        console.log(`@@${name} PM ${userId}: ${message}`)
      } catch (error) {
        socket.emit('error', '發生錯誤，請稍後再試')
      }
    })
  })

}




