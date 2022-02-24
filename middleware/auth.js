const passport = require('../config/passport')
const helper = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    next()
  })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
  const user = helper.getUser(req).toJSON()
  if (user?.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

const authenticatedUser = (req, res, next) => {
  if (user?.role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}