const passport = require('../config/passport')
const helpers = require('../_helpers')

// 驗證登入狀態
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: '尚未登入' })
    if (user) {
      req.user = user
    }
    next()
  })(req, res, next)
}

// admin 權限驗證
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: '權限不足' })
}

// user 權限驗證
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'user') return next()
  return res.status(403).json({ status: 'error', message: '權限不足' })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
