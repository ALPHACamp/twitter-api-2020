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
    await io.to('public room').emit('update-connected-users', connectedUsers, offlineUser)
  } catch (error) {
    console.log(error)
    await io.emit('error', '更新在線使用者時發生錯誤')
  }
}

async function broadcastPublicPrevMsgs(socket, userId) {
  try {
    const history = await Chatpublic.findAll({
      raw: true,
      nest: true,
      include: [{ model: User, attributes: userSelectedFields }],
      attributes: { exclude: ['updatedAt'] },
      order: [[sequelize.literal('createdAt'), 'ASC']],
    })

    const read = await Read.findOne({
      raw: true,
      nest: true,
      where: { UserId: userId, ChannelId: 0 }
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

    socket.emit('public-message', resHistory, read.date.getTime())

  } catch (error) {
    console.error('Error on broadcastPublicPrevMsgs: ', error)
    await socket.emit('error', 'Internal Server Error')
  }
}

async function broadcastPrivatePrevMsgs(socket, channelId) {
  try {
    const history = await Chatprivate.findAll({
      raw: true,
      nest: true,
      where: { ChannelId: channelId },
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
    // await io.to(`room ${roomId}`).emit('private-message', sender, message, timestamp, roomId, roomUsers)

    const bufferMessage = [{
      account: sender.account,
      name: sender.name,
      avatar: sender.avatar,
      ChannelId: roomId,
      UserId: sender.id,
      message: message,
      timestamp: timestamp
    }]

    await io.to(`room ${roomId}`).emit('private-message', bufferMessage)
  } catch (error) {
    console.log(error)
    socket.emit('error', '發生錯誤，請稍後再試')
  }
}

async function updateRead(userId, channelId, timestamp) {
  // not sure if there no matching whether the ORM will create one or not
  try {
    console.log('[Server Get ReadTime]: ', userId, channelId, timestamp)

    const outcome = await Read.update(
      { date: new Date(timestamp) },
      { where: { UserId: userId, ChannelId: channelId } }
    )
    if (outcome[0] === 0) {
      await Read.create({
        UserId: userId, ChannelId: 0, date: new Date(timestamp)
      })
    }
  } catch (error) {
    console.log('Update Read model fails.....', error)
  }
}

async function initPublicRoom(socket, sender, timestamp) {
  broadcastPublicPrevMsgs(socket, sender.id)
  // updateRead(sender.id, 0, timestamp)
}

async function initPrivateRooms(socket, sender, timestamp) {
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
  const channelIds = channelDetails.map(element => element.channelId)
  const messages = await Chatprivate.findAll({
    where: { ChannelId: channelIds },
    attributes: { exclude: ['updatedAt'] },
    order: [
      [sequelize.literal('createdAt'), 'ASC'],
    ],
    raw: true
  })

  const sortedRoomDetails = {}
  messages.forEach(msg => {
    sortedRoomDetails[msg.ChannelId] = { message: msg.message, time: msg.createdAt.getTime() }
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

async function initPrivateOneRoom(socket, userId, channelId, timestamp) {
  broadcastPrivatePrevMsgs(socket, channelId)
  // updateRead(userId, channelId, timestamp)
}

async function initUnreadMessages(socket, userId) {
  // handle public unread number
  const publicUnread = await getUnreadMessage(userId, 0, 'public')
  const channels = await Channel.findAll({
    where: {
      [Op.or]: [
        { UserOne: userId },
        { UserTwo: userId }
      ]
    },
    attributes: ['id'],
    raw: true
  })

  console.log('User channels...', channels)
  const privateUnread = await getUnreadMessage(userId, channels.map(c => c.id), 'private')

  socket.emit('message-unread-init', publicUnread, privateUnread)
}


async function getUnreadMessage(userId, channelId, roomType) {
  if (roomType === 'public') {
    const read = await Read.findOne({ where: { UserId: userId, ChannelId: channelId }, raw: true })
    const msgs = await Chatpublic.findAll({ raw: true, limit: 100 })
    const unreadNumber = msgs.map(msg => msg.createdAt.getTime()).filter(time => time > read.date.getTime()).length
    return unreadNumber
  } else {
    const read = await Read.findAll({
      attributes: ['ChannelId', 'date'],
      where: { UserId: userId, ChannelId: channelId },
      raw: true
    })
    const record = {}
    read.forEach(r => {
      record[r.ChannelId] = r.date.getTime()
    })
    const msgs = await Chatprivate.findAll({
      attributes: ['ChannelId', 'createdAt'],
      where: { ChannelId: channelId },
      raw: true
    })

    let unreadNumber = 0
    msgs.forEach(m => {
      if (m.createdAt.getTime() > record[m.ChannelId]) unreadNumber = unreadNumber + 1
    })
    return unreadNumber
  }


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

    // broadcast: getNewConnection
    getConnectedUsers(io, onlineUsers)

    // personal: public chatroom initialization
    socket.on('open-public-room', async (timestamp) => initPublicRoom(socket, sender, timestamp))
    // personal: private chatroom initialization
    socket.on('open-private-rooms', async (timestamp) => initPrivateRooms(socket, sender, timestamp))

    socket.on('open-private-room', async (channelId, timestamp) => initPrivateOneRoom(socket, sender.id, channelId, timestamp))

    // broadcast: public chatroom get message
    socket.on('public-message', async (message, timestamp) => getMessagesFromPublic(io, message, timestamp, sender))

    // personal: private chatroom get message
    socket.on('private-message', async (recipientId, message, timestamp) => getMessageFromPrivate(io, socket, sender, recipientId, message, timestamp))

    socket.on('message-read-timestamp', async (channelId, timestamp) => updateRead(sender.id, channelId, timestamp))

    socket.on('message-unread-init', async () => initUnreadMessages(socket, sender.id))

    socket.on('disconnect', async () => {
      delete onlineUsers[id]
      getConnectedUsers(io, onlineUsers, offlineUser = name)
    })
  })
}
