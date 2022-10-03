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
          throw new Error('帳號不存在！')
        case (req.originalUrl === '/api/admin/signin' && userData.role !== 'admin'):
          throw new Error('帳號不存在！')
        default: {
          delete userData.password
          const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '15d' })
          return res.json({
            status: 'success',
            data: { token, user: userData }
          })
        }
      }
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
