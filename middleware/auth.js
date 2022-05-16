const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedUser = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, () => {
    req.user = helpers.getUser(req)
    if (req.user && req.user.role !== 'admin') return next()
    return res.status(403).json({ status: 'error', message: 'Permission denied' })
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedUser,
  authenticatedAdmin
}
