const passport = require('../config/passport')

// check all routes' token
const authenticated = passport.authenticate('jwt', { session: false })

// check user's auth to right route
const authAdmin = (req, res, next) => {
  // 若使用管理帳號登入前台，等同於「帳號不存在」
  if (!req.user.isAdmin) return res.status(403).json({ status: 'error', message: 'Error: 無權限進入後台' })
  return next()
}

// check user's auth to right route
const authUser = (req, res, next) => {
  // 使用一般使用者帳號登入後台，等同於「帳號不存在」
  if (req.user.isAdmin) return res.status(403).json({ status: 'error', message: 'Error: 無權限進入前台' })
  return next()
}

module.exports = {
  authAdmin,
  authUser,
  authenticated
}
