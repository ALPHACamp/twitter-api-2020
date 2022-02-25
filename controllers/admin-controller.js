const jwt = require('jsonwebtoken')
const { User } = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { imgurFileHandler } = require('../helpers/file-helpers')
const adminController = {
  signIn: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        message: 'login success!',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) { next(err) }
  },
  getUsers: async (req, res, next) => {
    try {
      const user = User.findAll({ raw: true })
      console.log(user)
    } catch (err) { next(err) }
  }
}

module.exports = adminController