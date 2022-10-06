const { User } = require('../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req)?.toJSON()
      if (userData.role !== 'admin') {
        throw new Error('帳號不存在')
      }
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        token,
        userData
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
