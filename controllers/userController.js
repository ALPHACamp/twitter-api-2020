const { User } = require('../models')
const jwt = require('jsonwebtoken')

const userController = {
  signin: (req, res, next) => {
    try {
      delete req.user.password
      // sign a token (payload + key)
      const token = jwt.sign(req.user.toJSON(), process.env.JWT_SECRET, { expiresIn: '30d' })

      res.json({
        status: 'success',
        data:
          {
            token,
            user: req.user
          }
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
