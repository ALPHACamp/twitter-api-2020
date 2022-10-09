const jwt = require('jsonwebtoken')
const { getUser } = require('../_helpers')

const adminServices = {
  signIn: (req, cb) => {
    try {
      const userData = getUser(req).toJSON()
      if (userData.role !== 'admin') throw new Error('admin permission denied')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        token,
        user: userData
      })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = adminServices
