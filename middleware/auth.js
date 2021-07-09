const passport = require('../config/passport')
const helpers = require('../_helpers')
module.exports = {
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, user, info) => {
      if (error) {
        console.log(error)
        return res.status(500).json({ status: 'error', message: error.toString() })
      }
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'jwt token failed！' })
      }
      req.user = user
      return next()
    })(req, res, next)
  },

  authenticatedAdmin: (req, res, next) => {
    req.user = helpers.getUser(req)
    if (req.user && req.user.role === 'admin') return next()
    return res.status(401).json({ status: 'error', message: 'Permission denied.' })
  },

  authenticatedUser: (req, res, next) => {
    req.user = helpers.getUser(req)
    if (req.user && req.user.role !== 'admin') return next()
    return res.status(401).json({ status: 'error', message: 'Permission denied.' })
  }
}
