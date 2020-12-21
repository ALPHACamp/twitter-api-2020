const { connect } = require('../app')
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

async function getConnectedUsers(socket, io, rooms) {
  try {
    const connUserSck = {}

    // cause we need to update for all online users
    // frontend will get connectedUsers data dynamically
    // it should be remove req.user on rather frontend than backend 
    rooms.forEach((sck, key) => {
      if (Number(key)) connUserSck[key] = sck.values().next().value
    })

    const connectedUserIds = Object.keys(connUserSck).map(Number)
    const connectedUsers = await User.findAll({
      where: { id: { [Op.in]: connectedUserIds } },
      attributes: userSelectedFields,
      raw: true
    })

    connectedUsers.forEach((user, i) => user.sckId = connUserSck[user.id])

    await io.emit('update-connected-users', connectedUsers)
    // console.log('updated-connected-users: ', connectedUsers)
  } catch (error) {
    await io.emit('error', '更新在線使用者時發生錯誤')
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

    // broadcast
    getConnectedUsers(socket, io, io.sockets.adapter.rooms)

    // broadcast: public chatroom
    socket.on('public-message', async (message, timestamp) => {
      await io.emit('public-message', sender, message, timestamp)
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

    socket.on('disconnect', async () => {
      getConnectedUsers(socket, io.sockets.adapter.rooms)
    })

  })
}




