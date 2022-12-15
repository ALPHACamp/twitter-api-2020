const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')

const adminController = {
  login: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role !== 'admin') throw new Error('User account cannot enter!')
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
  },
  getUsers: (req, res) => {
    return res.send('admin users')
  }
}
module.exports = adminController
