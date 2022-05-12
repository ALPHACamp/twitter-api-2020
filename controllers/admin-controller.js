const { User } = require('../models')
const userServices = require('../services/user')

const adminController = {
  login: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      if (userData.role !== 'admin') {
        return res.status(403).json({ status: 'error', message: '非管理者' })
      }
      const token = await userServices.token(userData)
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        where: {
          role: 'user'
        }
      })
      res.status(200).json(users)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = adminController
