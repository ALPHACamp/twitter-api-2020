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

  getUser: (userId) => {
    return User.findByPk(userId)
      .then(user => {
        if (!user) {
          return
        } else {
          return user.toJSON()
        }
      })
      .catch(err => console.log(err))
  },

  postMessage: (userId, message) => {
    return Message.create({
      userId,
      content: message
    })
  },

  getMessages: (startId = 0, count = 0) => {
    const option = {
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']]
    }
    if (startId > 0 && count > 0) {
      option.where = { id: { [Op.lt]: startId } }
      option.limit = count
    } else if (count > 0) {
      option.limit = count
    }
    return Message.findAll(option)
  }
}

module.exports = chatController
