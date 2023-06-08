const { getUser } = require('../helpers/auth-helpers.js')
const { User } = require('../models')
const jwt = require('jsonwebtoken')
// 之後加'../helpers/file-helpers'

const adminController = {
  login: (req, res, next) => {
    try {
      const userData = getUser(req)?.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      if (userData.role !== 'admin') throw new Error('帳號不存在!')
      return res.json({
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

module.exports = adminController
