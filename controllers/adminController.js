const jwt = require('jsonwebtoken')
const { getUser } = require('../_helpers')
const adminController = {
  login: async (req, res, next) => {
    try {
      // get user data
      const userData = getUser(req)?.toJSON()
      delete userData.password
      // sign token
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
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

module.exports = adminController
