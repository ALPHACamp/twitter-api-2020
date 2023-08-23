'use strict'

const jwt = require('jsonwebtoken')
const { getUser } = require('../_helpers')

const adminController = {
  login: async (req, res, next) => {
    try {
      const userData = getUser(req).toJSON()
      delete userData.password

      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.status(200).json({
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
