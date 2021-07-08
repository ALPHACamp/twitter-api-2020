const jwt = require('jsonwebtoken')
const passport = require('../config/passport')

module.exports = {
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, user, info) => {
      if (error) {
        return res.status(500).json({ status: 'error', message: 'error' })
      }
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' })
      }
      req.user = user
      return next()
    })(req, res, next)
  },

  authenticatedAdmin: (req, res, next) => {
    if (req.user) {
      if (req.user.role === 'admin') { return next() }
      return res.status(403).json({ status: 'error', message: 'Admin only.User permission denied.' })
    } else {
      return res.status(401).json({ status: 'error', message: 'Permission denied' })
    }
  },
  authenticatedUser: (req, res, next) => {
    if (req.user) {
      if (req.user.role === 'user') { return next() }
      return res.status(403).json({ status: 'error', message: 'User only.Admin permission denied.' })
    } else {
      return res.status(401).json({ status: 'error', message: 'Permission denied' })
    }
  }
}
