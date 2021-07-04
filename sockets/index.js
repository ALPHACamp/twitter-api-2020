const passport = require('../config/passport')
const { User, Chatpublic, Chatprivate, Channel, Read, sequelize, Sequelize } = require('../models')
const { Op } = Sequelize
const userSelectedFields = ['id', 'account', 'name', 'avatar']
const onlineUsers = {}

const { getMessagesFromPublic, initPublicRoom } = require('./modules/public')
const { initPrivateRooms, initPrivateOneRoom, getMessageFromPrivate } = require('./modules/private')

function authenticated(socket, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) return next(error)
    if (!user) return next(new Error('未被授權'))
    if (user.role === 'admin') return next(new Error('未被授權'))
    socket.request.user = user
    return next()
  })(socket.request, {}, next)
}

async function getConnectedUsers(io, onlineUsers) {
  try {
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
    socket.on('private-message', async (recipientId, message, timestamp) => getMessageFromPrivate(io, socket, sender, recipientId, message, timestamp, onlineUsers))

    socket.on('message-read-timestamp', async (channelId, timestamp) => updateRead(sender.id, channelId, timestamp))

    socket.on('message-unread-init', async () => initUnreadMessages(socket, sender.id))

    socket.on('disconnect', async () => {
      delete onlineUsers[id]
      getConnectedUsers(io, onlineUsers)
    })
  })
}
