const db = require('../models')
const { User, Tweet, Like } = db
const { Op } = require("sequelize")
const bcrypt = require('bcryptjs')

const adminServices = {
  getUsers: async (req, cb) => {
    await User.findAndCountAll({
      where: {
        [Op.not]: [
          { role: 'admin' },
        ]
      },
      include: [Like, Tweet],
      nest: true
    })
      // ! 還沒成功取出Tweet&Like的數量
      .then(users => cb(null, { users }))
      .catch(err => cb(err))
  },
  getTweets: async (req, cb) => {
    await Tweet.findAll({
      order: [['createdAt', 'DESC']], //? post tweet功能做好後測試 order 功能
      include: [User],
      raw: true,
      nest: true
    })
      .then(tweets => cb(null, { tweets }))
      .catch(err => cb(err))
  }

}

module.exports = adminServices