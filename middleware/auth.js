const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  // passport.authenticate('jwt', { ses...
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ message: '尚未登入' })
    req.user = user
    next()
  })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') return next()
  return res.status(403).json({ message: '權限不足' })
}
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'user') return next()
  return res.status(403).json({ message: '帳號不存在' })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
