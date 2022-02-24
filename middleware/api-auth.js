const passport = require('../config/passport')
const helpers = require('../_helpers')
const authenticated = (res, req, next) => passport.authenticate('jwt', { session: false }, (err, user) => {
  if (user) {
    return next()
  }
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}) (res, req, next)
const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.idAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
