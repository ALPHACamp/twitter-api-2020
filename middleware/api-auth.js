const passport = require('../config/passport')
const authenticated = (req, res, next) => passport.authenticate('jwt', { session: false }, (err, user) => {
  if (!user) {
    return res.status(403).json({ status: 'error', message: 'permission denied' })
  }
  return next()
}) (req, res, next)
const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.idAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
