const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ success: 'false', message: 'unauthorized' })
    }
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next()
  return res
    .status(403)
    .json({ success: 'false', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
