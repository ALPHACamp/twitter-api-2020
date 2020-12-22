const { connect } = require('../app')
const passport = require('../config/passport')
const { User, Chatpublic, sequelize, Sequelize } = require('../models')
const { Op } = Sequelize
const userSelectedFields = ['id', 'account', 'name', 'avatar']

function authenticated(socket, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) return next(error)
    if (!user) return next(new Error('未被授權'))
    if (user.role === 'admin') return next(new Error('未被授權'))
    socket.request.user = user
    return next()
  })(socket.request, {}, next)
}

async function getConnectedUsers(io, rooms) {
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
  } catch (error) {
    await io.emit('error', '更新在線使用者時發生錯誤')
  }
}

async function broadcastPrevMsgs(socket) {
  try {
    const history = await Chatpublic.findAll({
      raw: true,
      nest: true,
      include: [{ model: User, attributes: userSelectedFields }],
      attributes: { exclude: ['updatedAt'] },
      order: [[sequelize.literal('createdAt'), 'DESC']],
    })

    resHistory = []
    history.forEach(element => {
      // flatten all the info
      res = { ...element.User }
      delete element.User
      res = { ...res, ...element }
      res.timestamp = element.createdAt.getTime()
      resHistory.push(res)
    })
    socket.emit('public-message', resHistory)

  } catch (error) {
    console.error('Error on broadcastPrevMsgs: ', error)
    await socket.emit('error', 'Internal Server Error')
  }
}

async function getMessagesFromPublic(io, message, timestamp, sender) {
  // is this await neccessary?
  await Chatpublic.create({
    UserId: sender.id,
    message: message
  })
  await io.emit('public-message', [{ ...sender, message, timestamp }])
  console.log(`${id} to everyone: ${message}`)
}

module.exports = (io) => {
  io.use(authenticated)

  io.on('connection', async (socket) => {
    const { id, account, name, avatar } = socket.request.user
    const sender = { id, account, name, avatar }
    console.log(`a user connected (userId: ${id} name: ${name})`)

    socket.join(id)

    // broadcast: getNewConnection
    broadcastPrevMsgs(socket)
    getConnectedUsers(io, io.sockets.adapter.rooms)

    // broadcast: public chatroom
    socket.on('public-message', async (message, timestamp) => getMessagesFromPublic(io, message, timestamp, sender))

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
      getConnectedUsers(io, io.sockets.adapter.rooms)
    })

  })
}




