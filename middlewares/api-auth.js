const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    if (user) {
      req.user = user
    }
    next()
  })(req, res, next)
}

const signinRoleUser = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'user') return next()
  throw new Error('account not exist')
}

const signinRoleAdmin = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'admin') return next()
  throw new Error('account not exist')
}

const authenticateUser = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
const authenticateAdmin = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  signinRoleUser,
  signinRoleAdmin,
  authenticateUser,
  authenticateAdmin
}
