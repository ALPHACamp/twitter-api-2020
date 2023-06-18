const helpers = require('../_helpers')
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.json({ status: 'error', message: 'Unauthorized' })
    }
    req.user = user // 把user結果存起來
    return next()
  })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: '帳號不存在！' })
}
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'user') return next()
  return res.status(403).json({ status: 'error', message: '帳號不存在！' })
}

module.exports = {
  authenticatedAdmin,
  authenticatedUser,
  authenticated
}