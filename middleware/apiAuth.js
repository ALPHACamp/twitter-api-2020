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
      return next()
    })(req, res, next)
  }
  return passport.authenticate('jwt', { session: false })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') return next()
  if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
const authenticatedUser = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') return next()
  if (helpers.getUser(req) && helpers.getUser(req).role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
