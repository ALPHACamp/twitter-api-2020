const jwt = require('jsonwebtoken')
const userServices = {
  signIn: (req, cb) => {
    try {
      const token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        status: 'success',
        data: {
          token,
          user: req.user
        }
      })
    } catch (err) {
      cb(err)
    }
  }
}
module.exports = userServices
