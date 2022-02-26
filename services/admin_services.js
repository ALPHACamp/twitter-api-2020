const jwt = require('jsonwebtoken')
const { getUser } = require('../_helpers')

const adminServices = {
  userLogin: (req, cb) => {
    const userData = getUser(req).toJSON()
    delete userData.password
    try {
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        status: 'success',
        message: '成功登入',
        token,
        userData
      })
    } catch (err) {
      cb(err)
    }
  }
}
module.exports = adminServices
