const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
module.exports = {
  authenticatedUser,
  authenticatedAdmin,
  authenticated
}
