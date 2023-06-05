const { getUser } = require('../../_helpers')
const jwt = require('jsonwebtoken')

const userController = {
  login: (req, res, next) => {
    try {
      const userData = getUser(req).toJSON()
      delete userData.password
      // if(!user) return res.json({status: 'failed'})
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發JWT，效期為30天
      res.json({
        status: 'success',
        data: {
          token, user: userData
        }
      })
    } catch (error) {
      next(error)
    }
  },
  signUp: (req, res, next) => {

  }
}

module.exports = userController
