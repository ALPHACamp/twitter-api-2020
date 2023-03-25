const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: '驗證失敗！' })
    req.user = user
    next()
  })(req, res, next)
}

const authenticatedUser = (req, res, next) => {
  if (req.user && req.user.role !== 'admin') return next()
  return res.status(403).json({ status: 'error', message: '驗證失敗！' })
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.role !== 'user') return next()
  return res.status(403).json({ status: 'error', message: '驗證失敗！' })
}

module.exports = {
  authenticated,
  authenticatedUser,
  authenticatedAdmin
}
