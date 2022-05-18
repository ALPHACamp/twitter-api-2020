const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.user = user.dataValues
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  req.user = helpers.getUser(req)
  if (req.user && req.user.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'admin permission denied' })
}

const authenticatedUser = (req, res, next) => {
  req.user = helpers.getUser(req)
  if (req.user && req.user.role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'user permission denied' })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
