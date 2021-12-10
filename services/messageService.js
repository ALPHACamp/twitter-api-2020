// 載入所需套件
const { Message, User, Room } = require('../models')
const helpers = require('../_helpers')
const { Op } = require('sequelize')

const messageService = {
  getPublicMessage: async (req, res, callback) => {
    const message = await Message.findAll({
      raw: true,
      nest: true,
      where: { RoomId: 1 },
      attributes: ['id', 'text', 'createdAt'],
      include: {
        model: User,
        attributes: ['id', 'avatar'],
        order: [['createdAt', 'ASC']]
      }
    })
    return callback(message)
  },

  getPrivateMessage: async (req, res, callback) => {
    const userId = req.body.id
    const currentUserId = helpers.getUser(req).id
    const RoomId = (await Room.findOne({ where: { [Op.or]: [{ [Op.and]: [{ creater: userId }, { listener: currentUserId }] }, { [Op.and]: [{ creater: currentUserId }, { listener: userId }] }] } })).id
    const message = await Message.findAll({
      raw: true,
      nest: true,
      where: { RoomId },
      attributes: ['id', 'text', 'createdAt'],
      include: {
        model: User,
        attributes: ['id', 'avatar'],
        order: [['createdAt', 'ASC']]
      }
    })
    return callback(message)
  }
}

// messageController exports
module.exports = messageService