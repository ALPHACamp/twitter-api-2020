const passport = require('../config/passport')
const { getUser } = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    const userData = user.toJSON()
    req.user = userData
    next()
  })(req, res, next)
}

const authenticatedUser = (req, res, next) => {
  if (getUser(req) && getUser(req).role !== 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

const authenticatedAdmin = (req, res, next) => {
  if (getUser(req) && getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedUser,
  authenticatedAdmin
}