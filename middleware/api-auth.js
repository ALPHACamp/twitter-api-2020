const helpers = require('../_helpers')
const passport = require('../config/passport')
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    }
    req.user = user // JWT 沒有使用 session，所以需要手動設置
    return next()
  })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
  const user = helpers.getUser(req)
  if (user && user.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

const authenticatedUser = (req, res, next) => {
  const user = helpers.getUser(req)
  if (user && user.role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
module.exports = {
  authenticated,
  authenticatedUser,
  authenticatedAdmin
}