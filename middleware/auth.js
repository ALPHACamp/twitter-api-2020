const passport = require('../config/passport')
const helpers = require('../_helpers')

// 檢查user role
const userRole = (req, res, next) => {
  if (helpers.getUser(req).role === 'admin') return res.status(403).json({ status: 'error', message: '帳號不存在' })
  next()
}

const adminRole = (req, res, next) => {
  if (helpers.getUser(req).role === 'user') return res.status(403).json({ status: 'error', message: '帳號不存在' })
  next()
}
// 驗證token
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.user = user
    next()
  })(req, res, next)
}

// 驗證user
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req).role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

// 驗證admin
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser,
  userRole,
  adminRole
}
