const passport = require('../config/passport')
const helpers = require('../_helpers')
// 驗證
const authenticated = (req, res, next) => {
  // 成功的話按照passport設定，取出user資料
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    req.user = user
    next()
  })(req, res, next)
}
// 使用者身分
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'Permission denied' })
}
// 管理者身分
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'Permission denied' })
}

// 擁有者身分
const authenticatedOwner = (req, res, next) => {
  if (helpers.getUser(req)?.id === Number(req.params.id)) return next()
  return res.status(403).json({ status: 'error', message: 'Permission denied' })
}

module.exports = {
  authenticated,
  authenticatedUser,
  authenticatedAdmin,
  authenticatedOwner
}
