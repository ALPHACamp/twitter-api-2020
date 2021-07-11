const jwt = require('jsonwebtoken')

const passport = require('../config/passport')

module.exports = {
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: `${info}`
        })
      }

      req.user = { ...user.dataValues }
      next()
    })(req, res, next) // TODO:要了解為什麼要加這個，不加就會沒辦法運作
  }

}