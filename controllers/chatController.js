const db = require('../models')
const User = db.User
const { Op } = require('sequelize')

const chatController = {
  getUsers: (users) => {
    return User.findAll({
      raw: true,
      nest: true,
      where: { id: { [Op.in]: users } }
    })
      .then(users => {
        return users
      })
      .catch(err => console.log(err))
  }
}

module.exports = chatController
