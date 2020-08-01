const db = require('../models')
const User = db.User
const { Op } = require('sequelize')

// const userIds = users.map(user => user.)

const chatController = {
  getUsers: async (users) => {
    await User.findAll({
      raw: true,
      nest: true,
      where: { id: { [Op.in]: users } }
    })
      .then(users => {
        return users
      })
  }
}

module.exports = chatController
