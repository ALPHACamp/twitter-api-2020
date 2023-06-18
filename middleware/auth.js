const passport = require('../config/passport')
const helpers = require('../_helpers')

// 檢查user role
const userRole = (req, res, next) => {
  if (helpers.getUser(req).role === 'admin') return res.status(403).json({ status: 'error', message: [{ path: 'account', msg: '帳號不存在' }] })
  next()
}

const adminRole = (req, res, next) => {
  if (helpers.getUser(req).role === 'user') return res.status(403).json({ status: 'error', message: [{ path: 'account', msg: '帳號不存在' }] })
  next()
}
// 驗證token
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: '未經授權' })
    req.user = user
    next()
  })(req, res, next)
}

// 驗證user
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req).role === 'user') return next()
  return res.status(403).json({ status: 'error', message: '無權限訪問' })
}

// 驗證admin
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: '無權限訪問' })
}

// 確認user是否存在
function validateUser (req, res, next) {
  const user = helpers.getUser(req)
  if (!user || !user.id) {
    return res.status(400).json({ status: 'error', message: '使用者不存在' })
  }
  next()
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser,
  userRole,
  adminRole,
  validateUser
}
