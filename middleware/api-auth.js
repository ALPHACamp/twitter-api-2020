const passport = require('../config/passport')
const { getUser } = require('../_helpers')
// 驗證是否為已持有 token 的登入帳號
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: '尚未登入' })
    req.user = user // 驗證成功後將 user 放入 req.user
    next()
  })(req, res, next)
}
// 驗證只有是管理者身分才能進入後台
const authenticatedAdmin = (req, res, next) => {
  if (getUser(req) && getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: '帳號不存在' })
}
// 驗證只有是一般使用者身分才能進入前台
const authenticatedUser = (req, res, next) => {
  if (getUser(req) && getUser(req).role === 'user') return next()
  return res.status(403).json({ status: 'error', message: '帳號不存在' })
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
