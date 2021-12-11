// 載入所需套件
const { Message, User, Room } = require('../models')
const createRoomName = require('../helpers/utils')
const helpers = require('../_helpers')
const { Op, Sequelize } = require('sequelize')

const messageService = {
  getPublicMessage: async (req, res, callback) => {
    const rawData = await Message.findAll({
      raw: true,
      nest: true,
      where: { roomName: 'public' },
      attributes: ['id', 'text', 'createdAt'],
      include: {
        model: User,
        attributes: ['id', 'avatar'],
        order: [['createdAt', 'ASC']]
      }
    })
    const messages = []
    for (let data of rawData) {
      let message = new Object()
      message.id = data.id
      message.text = data.text
      message.createdAt = data.createdAt
      message.UserId = data.User.id
      message.avatar = data.User.avatar
      messages.push(message)
    }
    return callback(messages)
  },

  getPrivateMessage: async (req, res, callback) => {
    const userId = Number(req.params.id)
    const currentUserId = helpers.getUser(req).id
    const roomName = createRoomName(userId, currentUserId)
    const rawData = await Message.findAll({
      raw: true,
      nest: true,
      where: { roomName },
      attributes: ['id', 'text', 'createdAt'],
      include: {
        model: User,
        attributes: ['id', 'avatar'],
        order: [['createdAt', 'ASC']]
      }
    })
    const messages = []
    for (let data of rawData) {
      let message = new Object()
      message.id = data.id
      message.text = data.text
      message.createdAt = data.createdAt
      message.UserId = data.User.id
      message.avatar = data.User.avatar
      messages.push(message)
    }
    return callback(messages)
  },

  getLatestMessage: async (req, res, callback) => {
    const lastestText = []
    const currentUserId = String(helpers.getUser(req).id)
    const rawData = await Message.findAll({
      raw: true,
      nest: true,
      where: {
        roomName: {
          [Op.or]: [{ [Op.like]: `%R${currentUserId}` }, { [Op.like]: `${currentUserId}R%` }]
        }
      },
      attributes: ['roomName', [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt']], group: ['roomName'],
    })
    for (let data of rawData) {
      const text = (await Message.findOne({
        where: data,
        attributes: ['text', 'createdAt', 'roomName']
      })).toJSON()
      lastestText.push(text)
    }
    console.log(lastestText)
  }
}

// messageController exports
module.exports = messageService