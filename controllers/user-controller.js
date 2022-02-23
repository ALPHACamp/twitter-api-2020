const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { User } = require('../models')


module.exports = {
  signin: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()

      switch (true) {
        case (req.originalUrl === '/api/signin' && userData.role !== 'user'):
          throw new Error('使用者不存在')
        
        case (req.originalUrl === '/api/admin/signin' && userData.role !== 'admin'):
          throw new Error('使用者不存在')

        default:
          delete userData.password
          const token = jwt.sign(
            userData,
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
          )
          return res.json({ token, user: userData })
      }

    } catch (err) { next(err) }
  }
}