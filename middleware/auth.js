const passport = require('../config/passport') // 引入 passport
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    if (user) {
      req.user = user
    }
    next()
  })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
  const userData = req.user.toJSON()
  if (userData && userData.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
const authenticatedUser = (req, res, next) => {
  const userData = req.user.toJSON()
  if (userData && userData.role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}