const passport = require('../config/passport')
const helpers = require('../_helpers')
// use helpers.getUser(req) to replace req.user

const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && (helpers.getUser(req).role === 'admin')) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
