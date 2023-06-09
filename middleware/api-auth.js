const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return res.status(401).json({ status: 'error', message: 'err' })
    if (!user) return res.status(401).json({ status: 'error', message: 'unauthorized' })


    req.user = user
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => { // Admin認證方式
  const userRole = req.user.role
  if (req.user && userRole === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
