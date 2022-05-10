const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') return next()
  return res.status(403).json({ status: 'error', message: '管理者不可於此登入。' })
}
const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: '使用者不可於此登入。' })
}
module.exports = {
  authenticatedUser,
  authenticatedAdmin,
  authenticated
}
