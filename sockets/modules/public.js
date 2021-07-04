const { User, Chatpublic, Read, sequelize, } = require('../../models')
const userSelectedFields = ['id', 'account', 'name', 'avatar']


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

async function getMessagesFromPublic(io, message, timestamp, sender) {
  // is this await neccessary?
  await Chatpublic.create({
    UserId: sender.id,
    message: message
  })
  await io.emit('public-message', [{ ...sender, message, timestamp }])
  console.log(`${sender.id} to everyone: ${message}`)
}

async function initPublicRoom(socket, sender, timestamp) {
  broadcastPublicPrevMsgs(socket, sender.id)
  // updateRead(sender.id, 0, timestamp)
}

module.exports = {
  getMessagesFromPublic,
  initPublicRoom
}