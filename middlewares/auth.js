const passport = require('../config/passport')
const helpers = require('../_helpers')

module.exports = {
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'without jwt' })
      }
      req.user = user
      return next()
    })(req, res, next)
  },

  authenticatedUser: (req, res, next) => {
    if (req.user && helpers.getUser(req).role !== 'admin') return next()
    return res.status(401).json({
      status: 'error',
      message: 'permission denied'
    })
  },

  authenticatedAdmin: (req, res, next) => {
    if (req.user && helpers.getUser(req).role === 'admin') return next()
    return res.status(401).json({
      status: 'error',
      message: 'permission denied'
    })
  }
}