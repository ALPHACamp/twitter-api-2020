const passport = require('passport')
const { getUser } = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.user = user
    next()
  })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
  if (getUser(req) && getUser(req).isAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied.' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
