const jwt = require('jsonwebtoken')
const { User } = require('../models')

const adminController = {
  signIn: (req, res, next) => {
    try {
      if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ status: 'error', message: "This account didn't exist!" })
      }

      const userData = req.user.toJSON()
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
  getUsers: (req, res, next) => {
    User.findAll({})
      .then(user => {
        return res.json({ status: 'success', user })
      })
      .catch(err => next(err))
  }

}

module.exports = adminController
