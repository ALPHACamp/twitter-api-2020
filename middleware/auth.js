const passport = require('../config/passport')
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.user = user.dataValues
    next()
  })(req, res, next)
}

const authenticatedUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedUser,
  authenticatedAdmin
}
