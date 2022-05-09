const { User } = require('../models')
const jwt = require('jsonwebtoken')

const userController = {
  register: async (req, res, next) => {
    try {
      const user = await User.create(req.body)
      res.json({ status: 'success', user })
    } catch (err) {
      next(err)
    }
  },
  login: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
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
  }
}
module.exports = userController
