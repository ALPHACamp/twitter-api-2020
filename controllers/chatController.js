const db = require('../models')
const User = db.User
const Message = db.Message
const { Op } = require('sequelize')

const chatController = {
  getUsers: (users) => {
    return User.findAll({
      raw: true,
      nest: true,
      where: { id: { [Op.in]: users } }
    })
  },

  postMessage: (userId, message) => {
    return Message.create({
      userId,
      content: message
    })
  },

  getMessages: (start = 0, count = 0) => {
    const option = {
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']]
    }
    if (count > 0) {
      option.offset = start
      option.limit = count
    }
    return Message.findAll(option)
  }
}

module.exports = chatController
