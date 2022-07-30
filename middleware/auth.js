const passport = require('../config/passport')
const { getUser } = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    if (error) return next(error)
    if (!user) {
      return res.status(403).json({
        status: 'error',
        message: '無使用者權限'
      })
    }
    req.user = user
    next()
  })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
  if (getUser(req) && getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: '無管理者權限' })
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
