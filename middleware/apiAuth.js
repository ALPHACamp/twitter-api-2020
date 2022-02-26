const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({
          status: 'error',
          message: 'permission denied!'
        })
      }
      req.user = user
      return next()
    })(req, res, next)
  }
}
const authenticatedAdmin = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') return next()
  if (req.user && helpers.getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
const authenticatedUser = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') return next()
  if (req.user && helpers.getUser(req).role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
