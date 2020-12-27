const { User, Chatprivate, Channel, sequelize, Sequelize } = require('../../models')
const { Op } = Sequelize
const userSelectedFields = ['id', 'account', 'name', 'avatar']


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

async function getMessageFromPrivate(io, socket, sender, recipientId, message, timestamp, onlineUsers) {
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

    // const recipientUser = await User.findByPk(recipientId, {
    //   attributes: userSelectedFields, raw: true
    // })

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

module.exports = {
  initPrivateRooms,
  initPrivateOneRoom,
  getMessageFromPrivate
}