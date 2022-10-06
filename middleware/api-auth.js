const passport = require('../config/passport')
const { getUser } = require('../helpers/auth-helper')

const authenticatedLocal = passport.authenticate('local', { session: false })
const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (getUser(req) && getUser(req).isAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedLocal
}
