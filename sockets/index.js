const { date } = require('faker')
const passport = require('../config/passport')
const { User, Chatpublic, Chatprivate, Channel, Read, sequelize, Sequelize } = require('../models')
const { Op } = Sequelize
const userSelectedFields = ['id', 'account', 'name', 'avatar']
const onlineUsers = {}

function authenticated(socket, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) return next(error)
    if (!user) return next(new Error('未被授權'))
    if (user.role === 'admin') return next(new Error('未被授權'))
    socket.request.user = user
    return next()
  })(socket.request, {}, next)
}

async function getConnectedUsers(io, onlineUsers, offlineUser = null) {
  try {
    // cause we need to update for all online users
    // frontend will get connectedUsers data dynamically
    // it should be remove req.user on rather frontend than backend 

    const connectedUserIds = Object.keys(onlineUsers).map(Number)
    const connectedUsers = await User.findAll({
      where: { id: { [Op.in]: connectedUserIds } },
      attributes: userSelectedFields,
      raw: true
    })

    connectedUsers.forEach((user, i) => {
      user.sckId = onlineUsers[user.id].map(socket => socket.id)
    })

    await io.to('public room').emit('update-connected-users', connectedUsers)
  } catch (error) {
    console.log(error)
    await io.emit('error', '更新在線使用者時發生錯誤')
  }
}

async function broadcastPublicPrevMsgs(socket) {
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
    console.error('Error on broadcastPublicPrevMsgs: ', error)
    await socket.emit('error', 'Internal Server Error')
  }
}

async function broadcastPrivatePrevMsgs(socket) {
  try {
    const history = await Chatprivate.findAll({
      raw: true,
      nest: true,
      where: { ChannelId: 1 },
      include: [{ model: User, attributes: userSelectedFields }],
      attributes: { exclude: ['updatedAt'] },
      order: [[sequelize.literal('createdAt'), 'ASC']],
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
    socket.emit('private-message', resHistory)
  } catch (error) {
    console.error('Error on broadcastPrivatePrevMsgs: ', error)
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
  console.log(`${sender.id} to everyone: ${message}`)
}

async function getMessageFromPrivate(io, socket, sender, recipientId, message, timestamp) {
  try {
    // check channels between two user id if exist
    let firstUser, secondUser;
    if (sender.id < recipientId) {
      firstUser = sender.id
      secondUser = Number(recipientId)
    } else {
      firstUser = Number(recipientId)
      secondUser = sender.id
    }

    // check the channel exist or not
    const channel = await Channel.findOne({
      where: {
        [Op.and]: [
          { UserOne: firstUser },
          { UserTwo: secondUser }
        ]
      },
      raw: true
    })

    const recipientUser = await User.findByPk(recipientId, {
      attributes: userSelectedFields, raw: true
    })

    let createdChannel;
    if (!channel) {
      createdChannel = await Channel.create({
        UserOne: firstUser, UserTwo: secondUser
      })
    }
    const roomId = channel.id || createdChannel.id
    const roomUsers = [
      {
        id: sender.id,
        socketId: onlineUsers[sender.id].map(socket => socket.id),
        name: sender.name,
        account: sender.account,
        avatar: sender.avatar
      },
      {
        id: recipientUser.id,
        socketId: onlineUsers[recipientId].map(socket => socket.id),
        name: recipientUser.name,
        account: recipientUser.account,
        avatar: recipientUser.avatar
      }
    ]

    // for all user device socket should be add into the same room
    onlineUsers[sender.id].forEach(socket => socket.join(`room ${roomId}`))
    try {
      onlineUsers[Number(recipientId)].forEach(socket => socket.join(`room ${roomId}`))
    } catch (error) {
      console.log('Private messages but that user is not online.')
    }

    // console.log(roomId)
    // console.log('>>>>', io.sockets.adapter)
    // console.log('>>>>', onlineUsers[Number(recipientId)][0].adapter)

    await Chatprivate.create({ ChannelId: roomId, UserId: sender.id, message: message })
    await io.to(`room ${roomId}`).emit('private-message', sender, message, timestamp, roomId, roomUsers)
  } catch (error) {
    console.log(error)
    socket.emit('error', '發生錯誤，請稍後再試')
  }
}

async function updateRead(userId, channelId, timestamp) {
  // not sure if there no matching whether the ORM will create one or not
  await Read.update(
    { date: new Date(timestamp) },
    { where: { UserId: userId, ChannelId: channelId } }
  )
}

async function initPublicRoom(socket, sender, timestamp) {
  broadcastPublicPrevMsgs(socket)
  updateRead(sender.id, 0, timestamp)
}

async function initPrivateRoom(socket, sender, timestamp) {
  const dataOne = await sequelize.query(`
    SELECT Channels.id AS channelId, Users.id AS uid, Users.name, Users.avatar, Users.account 
      FROM Channels 
      INNER JOIN Users on Users.id=Channels.UserTwo 
      WHERE Channels.UserOne= :userId; 
  `, { type: sequelize.QueryTypes.SELECT, replacements: { userId: sender.id } })

  const dataTwo = await sequelize.query(`
    SELECT Channels.id AS channelId, Users.id AS uid, Users.name, Users.avatar, Users.account 
      FROM Channels 
      INNER JOIN Users on Users.id=Channels.UserOne 
      WHERE Channels.UserTwo= :userId; 
  `, { type: sequelize.QueryTypes.SELECT, replacements: { userId: sender.id } })

  const channelDetails = dataOne.concat(dataTwo)
  const channelIds = channelDetails.map(element => element.ChannelId)
  const messages = Chatprivate.findAll({
    where: { ChannelId: channelIds },
    attributes: { exclude: ['updatedAt'] },
    order: [
      [sequelize.literal('createdAt'), 'ASC'],
    ],
    raw: true
  })

  const sortedRoomDetails = {}
  messages.forEach(msg => {
    sortedRoomDetails[msg.ChannelId] = { message: msg.message, time: msg.createdAt }
  })

  channelDetails.forEach(element => {
    sortedRoomDetails[element.channelId] = {
      channelId: element.channelId,
      uid: element.uid,
      name: element.name,
      avatar: element.avatar,
      account: element.account,
      ...sortedRoomDetails[element.channelId]
    }
  })

  socket.emit('open-private-rooms', Object.values(sortedRoomDetails))
}


module.exports = async (io) => {
  io.use(authenticated)

  io.on('connection', async (socket) => {
    const { id, account, name, avatar } = socket.request.user
    const sender = { id, account, name, avatar }
    console.log(`a user connected (userId: ${id} name: ${name})`)

    socket.join('public room')

    // prepare a dictionary to store online users key(user id) 
    // and value(socket id) array
    if (Object.keys(onlineUsers).includes(id)) {
      onlineUsers[id].push(socket)
    } else {
      onlineUsers[id] = [socket]
    }

    console.info('[STATUS] There are %s people online.', io.of("/").sockets.size)
    // console.log(io.of("/").in('public room').allSockets())
    // console.log('>>>>', io.sockets.adapter)

    // personal: public chatroom initialization
    socket.on('open-public-room', async (timestamp) => initPublicRoom(socket, sender, timestamp))
    // personal: private chatroom initialization
    socket.on('open-private-rooms', async (timestamp) => initPrivateRoom(socket, sender, timestamp))

    socket.on('open-private-room', async (channelId, timestamp) => updateRead(sender.id, channelId, timestamp))
    socket.on('open-private-room', async (channelId, timestamp) => broadcastPrivatePrevMsgs())

    // broadcast: getNewConnection
    getConnectedUsers(io, onlineUsers)

    // broadcast: public chatroom get message
    socket.on('public-message', async (message, timestamp) => getMessagesFromPublic(io, message, timestamp, sender))

    // personal: private chatroom get message
    socket.on('private-message', async (recipientId, message, timestamp) => getMessageFromPrivate(io, socket, sender, recipientId, message, timestamp))

    socket.on('disconnect', async () => {
      delete onlineUsers[id]
      getConnectedUsers(io, onlineUsers, offlineUser = name)
    })
  })
}
