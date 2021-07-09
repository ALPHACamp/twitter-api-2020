const jwt = require('jsonwebtoken')
const passport = require('../config/passport')

module.exports = {
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, user, info) => {
      if (error||!user) {
        return res.status(401).json({ status: 'error', message: 'jwt token failed！' })
      }
      req.user = user
      return next()
    })(req, res, next)
  },

  authenticatedAdmin: (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next()
    return res.status(401).json({ status: 'error', message: 'Permission denied.' })
  },
  authenticatedUser: (req, res, next) => {
    if (req.user && req.user.role === 'user') return next()
    return res.status(401).json({ status: 'error', message: 'Permission denied.' })
  }
}
