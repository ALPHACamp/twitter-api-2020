const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// const { User } = require('../models')
const helpers = require('../_helpers')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      switch (true) {
        case (req.originalUrl === '/api/users/signin' && userData.role !== 'user'):
          res.status(403).json({
            status: 'error',
            message: 'Permission denied.'
          })
          break
        case (req.originalUrl === '/api/admin/signin' && userData.role !== 'admin'):
          res.status(403).json({
            status: 'error',
            message: 'Permission denied.'
          })
          break
        default: {
          const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '15d' })
          return res.json({
            status: 'success', token, user: userData
          })
        }
      }
    } catch (err) {
      next(err)
    }
  },

  getCurrentUser: (req, res, next) => {
    try {
      const { id, email, account, name, avatar, role } = helpers.getUser(req)
      return res.json({ id, email, account, name, avatar, role })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
