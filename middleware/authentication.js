const passport = require('../config/passport')

//  everyone authenticated
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user) return res.status(401).json({ stauts: 'error', message: 'unauthorized' })
    if (err) return next(err)
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
