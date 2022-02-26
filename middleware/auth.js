const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: '沒有提供正確的authencation token' })

    req.user = user
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next()
  return res.status(403).json({ status: 'error', message: '權限不足，沒有提供正確的authencation token' })
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
