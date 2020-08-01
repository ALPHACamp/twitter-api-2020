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
  }
}

module.exports = chatController
