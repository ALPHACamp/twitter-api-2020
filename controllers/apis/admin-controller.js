const jwt = require('jsonwebtoken')
const helpers = require('../../_helpers')
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES || '30m'

const adminController = {
  signIn: (req, res, next) => {
    const userData = helpers.getUser(req).toJSON()
    try {
      // 非管理者不能登入後台
      if (userData.role !== 'admin') throw new Error('Account or Password is wrong!')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES })
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
