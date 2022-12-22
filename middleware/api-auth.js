const passport = require('../config/passport')
const helpers = require('../_helpers')
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ success: false, error: 'unauthorized' })
    req.user = user
    next()
  })(req, res, next)
}
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req) && (helpers.getUser(req).role === 'user')) return next()
  return res.status(403).json({ success: false, error: 'permission denied' })
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && (helpers.getUser(req).role === 'admin')) return next()
  return res.status(403).json({ success: false, error: 'permission denied' })
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
