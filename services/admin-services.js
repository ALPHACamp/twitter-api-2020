const jwt = require('jsonwebtoken')
const adminController = {
  signIn: async (req, cb) => {
    try {
      if (req.user.role !== 'admin') return cb(new Error('permission denied'))
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      const tokenData = {
        status: 'success',
        data: {
          token,
          User: userData
        }
      }
      return cb(null, { tokenData })
    } catch (err) {
      return cb(err)
    }
  }
}
module.exports = adminController
