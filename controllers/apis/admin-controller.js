const bcrypt = require('bcryptjs')
const { User } = require('../../models')
const jwt = require('jsonwebtoken')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      if (userData.role !== 'admin') throw new Error('Account does not exist!')
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
      res.status(500).json({ status: 'error', error: err.message })
    }
  }
}

module.exports = userController