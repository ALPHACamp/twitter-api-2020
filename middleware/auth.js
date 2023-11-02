const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    if (user.role === 'user') {
      req.user = user
      next()
    } else return res.status(401).json({ status: 'error', message: 'Unauthorized' })
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    if (user.role === 'admin') next()
    else return res.status(403).json({ status: 'error', message: 'permission denied' })
  })(req, res, next)
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
