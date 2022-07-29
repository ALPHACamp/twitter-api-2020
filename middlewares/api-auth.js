const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    if (user) {
      req.user = user
    }
    next()
  })(req, res, next)
}
const authenticateUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
const authenticateAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticateUser,
  authenticateAdmin
}
