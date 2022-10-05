const jwt = require('jsonwebtoken')
const { User } = require('../models')
const adminServices = {
  signIn: (req, cb) => {
    try {
      const token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, {
        status: 'success',
        data: {
          token,
          user: req.user
        }
      })
    } catch (err) {
      cb(err)
    }
  },
  getUsers: (req, cb) => {
    return User.findAll({
      raw: true
    })
      .then(users => cb(null, users))
      .catch(err => cb(err))
  }
}
module.exports = adminServices
